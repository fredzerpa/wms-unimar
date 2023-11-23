const ArcadatApi = require('../api/Arcadat/Arcadat.api');
const { getAllDebts, upsertDebtsByBundle } = require('../models/debts/debts.model');
const { getAllPayments } = require('../models/payments/payments.model');
const { upsertParentsByBundle, getAllParents } = require('../models/parents/parents.model');
const { upsertPaymentsByBundle } = require('../models/payments/payments.model');
const { upsertStudentsByBundle, getAllStudents } = require('../models/students/students.model');
const { upsertEmployeesByBundle } = require('../models/employees/employees.model');
const { DateTime } = require('luxon');

async function updateStudentsCollection() {
  const [
    arcadatStudents,
    dbStudents,
    gradesByEducationLevels
  ] = await Promise.all([
    ArcadatApi.getStudents(),
    getAllStudents(),
    ArcadatApi.getGrades()
  ]);

  // Creamos un valor inicial de los Estudiantes en la BD para enlazarlas con los estudiantes Activos en Arcadat
  const INITIAL_STUDENTS_DATA = dbStudents.map(student => {
    // isActive es falso, ya que no sabemos si sigue activo o no hasta que se verifique con Arcadat API
    student.isActive = false;
    return student;
  });

  /* 
    Esta variable contendra todos los estudiantes de manera unica ...
    registrando los estudiantes no cursantes actualmente como no activos ...
    es necesario debido al propenso cambio de cedula y/o nombre del estudiante ...
    ocasianando duplicacion en la creacion de documentos.
  */
  const studentsDataUpdated = arcadatStudents.reduce((studentsDataUpdated, studentCurrentData) => {
    delete studentCurrentData.age; // Esta propiedad que viene de ARCADAT es innecesaria

    // Buscamos si el estudiante ya fue registrado. El nombre o su cedula es propenso a cambios
    const { studentFound, studentFoundIndex } = studentsDataUpdated.reduce((state, student, idx) => {
      // ! Esta validacion solo aplica si tanto la propiedad 'fullname' como 'documentId.number' no han cambiado al mismo tiempo
      const isSameStudent = (student?.fullname === studentCurrentData.fullname) || (student?.documentId?.number === studentCurrentData.documentId.number)
      if (isSameStudent) {
        state.studentFound = student;
        state.studentFoundIndex = idx;
      }
      return state;
    }, { studentFound: null, studentFoundIndex: undefined });

    // Si existe lo actualizamos, si no existe lo agregamos
    studentFound ?
      studentsDataUpdated.splice(
        studentFoundIndex,
        1, // Reemplazamos solamente 1 item del array, el del estudiante encontrado
        {
          ...studentFound, // Agregamos las propiedades proveniente de la DB, ya que no todas las propiedades estan en API
          ...studentCurrentData,  // Actualizamos con los datos del estudiante en la BD con los del API
          familyMembers: { ...studentFound.familyMembers } // Los datos actuales del estudiante no tienen los ObjectsId de los familiares
        })
      :
      studentsDataUpdated.push(studentCurrentData)

    return studentsDataUpdated;
  }, INITIAL_STUDENTS_DATA)

  // Esquema de las calificaciones escolares, para incluirla en los estudiantes inscritos por primera vez en la BDD
  const STUDENT_GRADES_SCHEMA = {
    elementary: {
      firstLevel: [],
      secondLevel: [],
      thirdLevel: [],
    },
    middleschool: {
      firstGrade: [],
      secondGrade: [],
      thirdGrade: [],
      fourthGrade: [],
      fifthGrade: [],
      sixthGrade: [],
    },
    highschool: {
      firstYear: [],
      secondYear: [],
      thirdYear: [],
      fourthYear: [],
      fifthYear: [],
    }
  }
  // Agregamos las calificaciones a los estudiantes
  const studentsDataUpdatedWithGrades = studentsDataUpdated.map(student => {
    const gradesByEducationLevelsEntries = Object.entries(gradesByEducationLevels);
    const schoolTerm = gradesByEducationLevelsEntries.shift()[1]; // Eliminamos el 'schoolTerm' prop

    // Agregamos el esquema de calificaciones al estudiante
    // ya que si el estudiante es nuevo ocasionara un bug de undefined al agregarle sus notas
    student.grades = student?.grades || STUDENT_GRADES_SCHEMA;

    student.grades = gradesByEducationLevelsEntries
      .reduce((studentGrades, [educationLevel, classroomsGrades]) => {
        const { studentClassroomGrades, studentGradesByStage } = Object.entries(classroomsGrades).reduce((yearGrades, [classroomGrade, grades]) => {
          const studentGrades = grades.find(grade => grade.student.fullname === student.fullname)?.stages;

          if (!studentGrades) return yearGrades;

          return {
            studentClassroomGrades: classroomGrade,
            studentGradesByStage: studentGrades,
          }
        }, { studentClassroomGrades: null, studentGradesByStage: {} });

        if (!studentClassroomGrades) return studentGrades;

        // Buscamos si ya se monto las calificaciones de este periodo escolar y si es asi las actualizamos o las agregamos
        const studentClassroomUniqueGrades = studentGrades?.[educationLevel]?.[studentClassroomGrades]?.map(grade => {
          return grade.schoolTerm === schoolTerm ? { schoolTerm, stages: studentGradesByStage } : grade;
        });
        return {
          ...studentGrades,
          [educationLevel]: {
            ...studentGrades[educationLevel],
            [studentClassroomGrades]: studentClassroomUniqueGrades
          },
        };
      }, student.grades)

    return student;
  })

  return await upsertStudentsByBundle(studentsDataUpdatedWithGrades);
}

async function updateParentsCollection() {
  const [arcadatParents, dbParents] = await Promise.all([ArcadatApi.getParents(), getAllParents()]);

  const parentsDataUpdated = arcadatParents.map(arcadatParent => {
    const parentMatch = dbParents.find(dbParent => dbParent.documentId.number === arcadatParent.documentId.number)

    // Mantenemos los Refs del padre para que estos no se eliminen durante el Upserts
    // creando una operacion innecesaria
    return { ...arcadatParent, children: parentMatch?.children }
  })

  return await upsertParentsByBundle(parentsDataUpdated);
}

async function updatePaymentsCollection() {
  const [arcadatPayments, dbStudents] = await Promise.all([ArcadatApi.getPayments(), getAllStudents()]);

  // Buscamos los pagos con un maximo de 30 dias de antiguedad
  const filterDate = DateTime.now().minus({ days: 30 });
  const paymentsFilteredByDate = arcadatPayments.filter(({ time: { date } }) => (
    DateTime.fromFormat(date, 'd/M/yyyy').diff(filterDate, 'days').as('days') >= 0
  ));

  // Agregamos todos los Refs (Objects Id) que posea el Payments Schema
  const paymentsWithRefsLinked = paymentsFilteredByDate.reduce((paymentsWithRefs, payment) => {
    // Agregamos los estudiantes Object Id a los pagos
    const paymentStudentFound = dbStudents.find(student => student.documentId.number === payment.student.documentId.number);

    // Si el estudiante es undefined es porque no existe en la bdd y es un estudiante antiguo
    if (!paymentStudentFound) return paymentsWithRefs;

    /* 
    ! Solo agregamos el ID del estudiante, ya que el upsert usa como match field 'student'
      y el Payment Schema solo registra el ID, por lo que un Object !== _id (String)
    */
    payment.student = paymentStudentFound._id;
    paymentsWithRefs.push(payment);

    return paymentsWithRefs;
  }, [])

  return await upsertPaymentsByBundle(paymentsWithRefsLinked);
}

async function updateDebtsCollection() {
  const [
    arcadatDebts,
    dbDebts,
    dbStudents,
    dbPayments
  ] = await Promise.all([
    ArcadatApi.getPendingDebts(),
    getAllDebts(),
    getAllStudents(),
    getAllPayments()
  ]);

  // Creamos un valor inicial de las deudas traidas de la BD para enlazarlas con las deudas pendientes en Arcadat
  const INITIAL_DEBTS_DATA = new Map(dbDebts?.map(debt => {
    debt.status.pending = false; // Ya que no sabemos si aun sigue vigente

    // Creamos una llave unica para identificar cada deuda
    const debtKey = debt.schoolTerm + debt.concept + debt.student;

    // Este paso es necesario ya que usualmente se paga al contado y la deuda deja de estar pendiente
    // Agregamos/Sobreescribimos los ref de pagos a la deuda (cada deuda puede pagarse en partes)
    debt.payments = dbPayments.filter(payment => {
      // Creamos un key que sea identico al debtKey para identificar los pagos a esa deuda
      const paymentKey = payment.schoolTerm + payment.concept + payment.student;
      return paymentKey === debtKey;
    })

    return [debtKey, debt];
  }));

  // Agregamos todos los Refs (Objects Id) que posea el Debt Schema
  const debtsWithRefsLinked = [...arcadatDebts.reduce((updatedDebts, debt) => {    // Enlazamos el estudiante a las deudas correspondientes
    // Agregamos el ref del estudiante
    const debtStudentFound = dbStudents.find(student => student.documentId.number === debt.student.documentId.number);

    // Si el estudiante es undefined es porque no existe en la bdd y es un estudiante antiguo
    if (!debtStudentFound) return updatedDebts;

    /* 
    ! Solo agregamos el ID del estudiante, ya que el upsert usa como match field 'student'
    !  y el Debt Schema solo registra el ID, por lo que un Object !== _id (String)
    */
    debt.student = debtStudentFound._id

    // Creamos una llave unica para identificar cada deuda
    const debtKey = debt.schoolTerm + debt.concept + debt.student;

    // Agregamos/Sobreescribimos los ref de pagos a la deuda (cada deuda puede pagarse en partes)
    debt.payments = dbPayments.filter(payment => {
      // Creamos un key que sea identico al debtKey para identificar los pagos a esa deuda
      const paymentKey = payment.schoolTerm + payment.concept + payment.student;
      return paymentKey === debtKey;
    })

    // Incluimos los meta-datas
    debt.amount.initial = debt.payments.filter(payment => !payment.canceled).reduce((total, payment) => ({
      usd: parseFloat(((total?.usd ?? 0) + (payment?.amount?.usd ?? 0)).toFixed(2)), // Si el pago no posee 'usd' suma 0
    }), debt.amount.pending);

    const lastPaymentAdded = debt.payments.reduce((lastPaymentRecorded, payment) => {
      // Si es undefined es porque no existe pago registrado a esta deuda 
      if (!lastPaymentRecorded) return lastPaymentRecorded;

      const lastPaymentDateTime = DateTime.fromFormat(lastPaymentRecorded.time.date, 'd/M/y');
      const currentPaymentDateTime = DateTime.fromFormat(payment.time.date, 'd/M/y');

      // Sorteamos los pagos por el mas actual
      const isNewer = lastPaymentDateTime.diff(currentPaymentDateTime).as('days') < 0;
      if (isNewer) return payment;

      return lastPaymentRecorded;
    }, debt.payments.at(-1));
    debt.status.lastUpdate = lastPaymentAdded?.time?.datetime // El ultimo update sera la fecha del ultimo pago registrado

    // Agregamos/actualizamos las deudas vigentes
    updatedDebts.set(debtKey, debt);

    return updatedDebts;
  }, INITIAL_DEBTS_DATA).values()]

  // Si mantiene un pending = false entonces la deuda ya fue saldada
  // por lo que es necesario cambiar su valor pendiente a 0
  const debtsUpdated = debtsWithRefsLinked.map(debt => {
    if (!debt.status.pending) debt.amount.pending.usd = 0;
    return debt;
  })

  /* 
    Las deudas provenientes de ARCADAT actualiza el monto dependiendo si se realizo algun pago
    Por lo que es no solo se actualizara la propiedad 'payments' si no tambien 'amount'
  */
  return await upsertDebtsByBundle(debtsUpdated);
}

async function updateEmployeesCollection() {
  const arcadatEmployees = await ArcadatApi.getEmployees();
  return await upsertEmployeesByBundle(arcadatEmployees);
}

async function addStudentsAndParentsRefs() {
  const [
    arcadatStudents,
    dbStudents,
    arcadatParents,
    dbParents
  ] = await Promise.all([
    ArcadatApi.getStudents(),
    getAllStudents(),
    ArcadatApi.getParents(),
    getAllParents()
  ])

  /* 
  * STUDENTS REFS 
  */
  const studentsWithRefsLinked = arcadatStudents.map(arcadatStudent => {
    // Usamos la data de la BDD para mantener las mismas propiedades
    const studentMatch = dbStudents.find(dbStudent => dbStudent.documentId.number === arcadatStudent.documentId.number);

    // Agregamos los padres (parents con Object Id) al estudiante
    const parentsData = Object.entries(arcadatStudent.familyMembers.parents).reduce((parents, [parentType, parentData]) => {
      parents[parentType] = dbParents.find(parent => parent.documentId.number === parentData.documentId.number);
      return parents;
    }, {})
    studentMatch.familyMembers.parents = parentsData;

    // Agregamos los hermanos (estudiantes con Object Id) al estudiante
    const studentParentAdmin = arcadatParents.find(parent => parent.documentId.number === arcadatStudent.familyMembers.parents.admin.documentId.number)
    const sibilingsData = studentParentAdmin.children.reduce((siblings, child) => {
      // Agregamos los hijos del padre (admin) excluyendo al propio estudiante
      if (child.documentId.number !== studentMatch.documentId.number) {
        siblings.push(dbStudents.find(dbStudent => dbStudent.documentId.number === child.documentId.number))
      }

      return siblings;
    }, [])
    studentMatch.familyMembers.siblings = sibilingsData;

    return studentMatch;
  });

  /* 
  * PARENTS REFS 
  */
  // No es necesario usar un Parent Match
  // ya que cuando agregamos a los padres se hace directamente por la data de ARCADAT
  const parentsWithRefsLinked = arcadatParents.map(parent => {
    // Agregamos los hijos (estudiantes Object Id) a los padres 
    parent.children = parent.children.map(child => dbStudents.find(student => student.documentId.number === child.documentId.number))
    return parent;
  })

  const [studentsRefsUpserted, parentsRefsUpserted] = await Promise.allSettled([upsertStudentsByBundle(studentsWithRefsLinked), upsertParentsByBundle(parentsWithRefsLinked)])

  return { studentsRefsUpserted, parentsRefsUpserted };
}

const refreshedCollectionMessage = (collectionName = '', refreshResponse = {}) => {
  console.log(`
  Collection: ${collectionName}
    ${refreshResponse?.nUpserted} added. 
    ${refreshResponse?.nMatched} checked. 
    ${refreshResponse?.nModified} updated.
  `);
}

async function refreshCollections() {
  try {
    console.log('Starting refreshing Collections..');

    console.time('Students Time')
    const studentsRefresh = await updateStudentsCollection();
    refreshedCollectionMessage('Students', studentsRefresh);
    console.timeEnd('Students Time')

    console.time('Parents Time')
    const parentsRefresh = await updateParentsCollection();
    refreshedCollectionMessage('Parents', parentsRefresh);
    console.timeEnd('Parents Time')

    console.time('Students & Parents Refs Linked Time')
    const { studentsRefsUpserted, parentsRefsUpserted } = await addStudentsAndParentsRefs();
    console.log(`Students Refs Added: ${studentsRefsUpserted.status === 'fulfilled'}`)
    console.log(`Parents Refs Added: ${parentsRefsUpserted.status === 'fulfilled'}`)
    console.timeEnd('Students & Parents Refs Linked Time')

    console.time('Payments Time')
    const paymentsRefresh = await updatePaymentsCollection();
    refreshedCollectionMessage('Payments', paymentsRefresh);
    console.timeEnd('Payments Time')

    console.time('Debts Time')
    const debtsRefresh = await updateDebtsCollection();
    refreshedCollectionMessage('Debts', debtsRefresh);
    console.timeEnd('Debts Time')

    console.time('Employees Time')
    const employeesRefresh = await updateEmployeesCollection();
    refreshedCollectionMessage('Employees', employeesRefresh);
    console.timeEnd('Employees Time')

    console.log('Done refreshing Collections.');
  } catch (err) {
    console.log('Error refreshing the collections.', err.message);
  }
}

module.exports = {
  refreshCollections,
};
