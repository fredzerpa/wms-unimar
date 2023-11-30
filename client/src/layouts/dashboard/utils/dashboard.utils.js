import { DateTime, Info } from "luxon";
import lodash from "lodash";
import { formatPercentage } from "utils/functions.utils";

export const todayDT = DateTime.now().setLocale("es-ES");

export const LAST_THREE_MONTHS_LABELS = Info.months("short", { locale: "es-ES" }).filter((month, idx) => idx >= todayDT.month - 3 && idx < todayDT.month).map(lodash.capitalize);
export const FORMER_LAST_THREE_MONTHS_LABELS = Info.months("short", { locale: "es-ES" }).filter((month, idx) => idx >= todayDT.month - 6 && idx < todayDT.month - 3).map(lodash.capitalize);
export const LAST_SIX_MONTHS_LABELS = Info.months("short", { locale: "es-ES" }).filter((month, idx) => idx >= todayDT.month - 6 && idx < todayDT.month).map(lodash.capitalize);
export const FORMER_LAST_SIX_MONTHS_LABELS = Info.months("short", { locale: "es-ES" }).filter((month, idx) => idx >= todayDT.month - 12 && idx < todayDT.month - 6).map(lodash.capitalize);


export const sumBillsTotal = array => Number(array.reduce((total, bill) => total + bill.total.usd, 0).toFixed(2));

export const getShippingsByWeekNumber = (shippings, weekNumber) => {
  if (lodash.isEmpty(shippings) || !weekNumber) return []

  const weekDT = todayDT.set({ weekNumber }).startOf("week");
  const nextWeekDT = todayDT.set({ weekNumber }).plus({ weeks: 1 }).startOf("week");

  const filteredShippings = shippings.filter(shipping => {
    const shippingDT = DateTime.fromFormat(shipping.date, "dd/MM/yyyy");
    const isFromTheWeekNumber = shippingDT.diff(weekDT).as("milliseconds") > 0 && shippingDT.diff(nextWeekDT).as("milliseconds") < 0;
    return isFromTheWeekNumber;
  })

  return filteredShippings;
}

// El @target es el nuevo valor que buscamos calcular su diferencia con
// el @source el cual es el valor anterior y sera la base para calcular la diferencia 
export const getDiff = (target, source) => {
  // Si el source es 0 el valor da Infinity
  const diff = source > 0 ? (target / source) - 1 : 0; // El 1 representa el 100% base, por lo que al quitarselo obtenemos cuando fue el cambio

  return {
    value: diff,
    label: source > 0 ? formatPercentage(diff, { signDisplay: "always" }) : null, // Puede obtenerse valores antiguos no agregados a la BDD
    color: diff === 0 ? "dark" : (diff > 0 ? "success" : "error"),
  }
}

export const getShippingsByMonth = (shippings, monthNumber) => {
  if (lodash.isEmpty(shippings)) return []

  const filteredShippingsByMonth = shippings.filter(shipping => {
    const shippingDT = DateTime.fromFormat(shipping.date, "dd/MM/yyyy");
    const shippingMonthValid = shippingDT.month === monthNumber;
    return shippingDT.year === todayDT.year && shippingMonthValid;
  });

  return filteredShippingsByMonth;
}

export const getLastThreeMonthsShippings = shippings => {
  if (lodash.isEmpty(shippings)) return [];
  const INITIAL_VALUE = LAST_THREE_MONTHS_LABELS.map(label => ({ label, shippings: [] }))
  const lastSixMonthsShippings = shippings.reduce((months, shipping) => {
    // Calculamos cuantos meses han pasado y para evitar cualquier mal calculo ponemos el mismo dia a ambos DateTimes
    const shippingDT = DateTime.fromFormat(shipping.date, "dd/MM/yyyy").setLocale("es-ES").startOf("month");
    const monthsPassedSinceShippingStarted = todayDT.startOf("month").diff(shippingDT.startOf("month")).as("months");
    const isSixMonthsAgoFromNow = monthsPassedSinceShippingStarted >= 0 && monthsPassedSinceShippingStarted < 3;

    if (!isSixMonthsAgoFromNow) return months; // Solo interesa los ultimos 3 meses de shippings - Valores entre 0-2

    const index = months.findIndex(month => month.label.toLowerCase() === shippingDT.monthShort.toLowerCase())
    if (!months[index]) return months;

    months[index].shippings.push(shipping);

    return months;
  }, INITIAL_VALUE)

  return lastSixMonthsShippings;
}
export const getFormerLastThreeMonthsShippings = shippings => {
  if (lodash.isEmpty(shippings)) return [];
  const INITIAL_VALUE = FORMER_LAST_THREE_MONTHS_LABELS.map(label => ({ label, shippings: [] }))
  const lastSixMonthsShippings = shippings.reduce((months, shipping) => {
    // Calculamos cuantos meses han pasado y para evitar cualquier mal calculo ponemos el mismo dia a ambos DateTimes
    const shippingDT = DateTime.fromFormat(shipping.date, "dd/MM/yyyy").setLocale("es-ES").startOf("month");
    const monthsPassedSinceShippingStarted = todayDT.startOf("month").diff(shippingDT.startOf("month")).as("months");
    const isSixMonthsAgoFromNow = monthsPassedSinceShippingStarted >= 3 && monthsPassedSinceShippingStarted < 6;

    if (!isSixMonthsAgoFromNow) return months; // Solo interesa los anteriores ultimos 3 meses de shippings - Valores entre 2-5

    const index = months.findIndex(month => month.label.toLowerCase() === shippingDT.monthShort.toLowerCase())
    if (!months[index]) return months;

    months[index].shippings.push(shipping);

    return months;
  }, INITIAL_VALUE)

  return lastSixMonthsShippings;
}

export const getLastSixMonthsShippings = shippings => {
  if (lodash.isEmpty(shippings)) return [];
  const INITIAL_VALUE = LAST_SIX_MONTHS_LABELS.map(label => ({ label, shippings: [] }))
  const lastSixMonthsShippings = shippings.reduce((months, shipping) => {
    // Calculamos cuantos meses han pasado y para evitar cualquier mal calculo ponemos el mismo dia a ambos DateTimes
    const shippingDT = DateTime.fromFormat(shipping.date, "dd/MM/yyyy").setLocale("es-ES").startOf("month");
    const monthsPassedSinceShippingStarted = todayDT.startOf("month").diff(shippingDT.startOf("month")).as("months");
    const isSixMonthsAgoFromNow = monthsPassedSinceShippingStarted >= 0 && monthsPassedSinceShippingStarted < 6;

    if (!isSixMonthsAgoFromNow) return months; // Solo interesa los ultimos 6 meses de shippings - Valores entre 0-5

    const index = months.findIndex(month => month.label.toLowerCase() === shippingDT.monthShort.toLowerCase())
    if (!months[index]) return months;

    months[index].shippings.push(shipping);

    return months;
  }, INITIAL_VALUE)

  return lastSixMonthsShippings;
}

export const getFormerLastSixMonthsShippings = shippings => {
  if (lodash.isEmpty(shippings)) return [];
  const INITIAL_VALUE = FORMER_LAST_SIX_MONTHS_LABELS.map(label => ({ label, shippings: [] }))
  const lastSixMonthsShippings = shippings.reduce((months, shipping) => {
    // Calculamos cuantos meses han pasado y para evitar cualquier mal calculo ponemos el mismo dia a ambos DateTimes
    const shippingDT = DateTime.fromFormat(shipping.date, "dd/MM/yyyy").setLocale("es-ES").startOf("month");
    const monthsPassedSinceShippingStarted = todayDT.startOf("month").diff(shippingDT.startOf("month")).as("months");
    const isSixMonthsAgoFromNow = monthsPassedSinceShippingStarted >= 6 && monthsPassedSinceShippingStarted < 12;

    if (!isSixMonthsAgoFromNow) return months; // Solo interesa los anteriores ultimos 6 meses de shippings - Valores entre 6-11

    const index = months.findIndex(month => month.label.toLowerCase() === shippingDT.monthShort.toLowerCase())
    if (!months[index]) return months;

    months[index].shippings.push(shipping);

    return months;
  }, INITIAL_VALUE)

  return lastSixMonthsShippings;
}

export const getBillsByWeekNumber = (bills, weekNumber) => {
  if (lodash.isEmpty(bills) || !weekNumber) return []

  const weekDT = todayDT.set({ weekNumber }).startOf("week");
  const nextWeekDT = todayDT.set({ weekNumber }).plus({ weeks: 1 }).startOf("week");

  const filteredBills = bills.filter(shipping => {
    const billDT = DateTime.fromFormat(shipping.date, "dd/MM/yyyy");
    const isFromTheWeekNumber = billDT.diff(weekDT).as("milliseconds") > 0 && billDT.diff(nextWeekDT).as("milliseconds") < 0;
    return isFromTheWeekNumber;
  })

  return filteredBills;
}

export const getInventoryByMonth = (records, monthNumber) => {
  if (lodash.isEmpty(records)) return []

  const filteredInventoryByMonth = records.filter(record => {
    const recordDT = DateTime.fromFormat(record.entryDate, "dd/MM/yyyy");
    const recordMonthValid = recordDT.month === monthNumber;
    return recordDT.year === todayDT.year && recordMonthValid;
  });

  return filteredInventoryByMonth;
}


export const getLastThreeMonthsBills = bills => {
  if (lodash.isEmpty(bills)) return [];
  const INITIAL_VALUE = LAST_THREE_MONTHS_LABELS.map(label => ({ label, bills: [] }))
  const lastSixMonthsBills = bills.reduce((months, bill) => {
    // Calculamos cuantos meses han pasado y para evitar cualquier mal calculo ponemos el mismo dia a ambos DateTimes
    const billDT = DateTime.fromFormat(bill.date, "dd/MM/yyyy").setLocale("es-ES").startOf("month");
    const monthsPassedSinceBillStarted = todayDT.startOf("month").diff(billDT.startOf("month")).as("months");
    const isSixMonthsAgoFromNow = monthsPassedSinceBillStarted >= 0 && monthsPassedSinceBillStarted < 3;

    if (!isSixMonthsAgoFromNow) return months; // Solo interesa los ultimos 3 meses de billos - Valores entre 0-2

    const index = months.findIndex(month => month.label.toLowerCase() === billDT.monthShort.toLowerCase())
    if (!months[index]) return months;

    months[index].bills.push(bill);

    return months;
  }, INITIAL_VALUE)

  return lastSixMonthsBills;
}

export const getFormerLastThreeMonthsBills = bills => {
  if (lodash.isEmpty(bills)) return [];
  const INITIAL_VALUE = FORMER_LAST_THREE_MONTHS_LABELS.map(label => ({ label, bills: [] }))
  const lastSixMonthsBills = bills?.reduce((months, bill) => {
    // Calculamos cuantos meses han pasado y para evitar cualquier mal calculo ponemos el mismo dia a ambos DateTimes
    const billDT = DateTime.fromFormat(bill.date, "dd/MM/yyyy").setLocale("es-ES").startOf("month");
    const monthsPassedSinceBillStarted = todayDT.startOf("month").diff(billDT.startOf("month")).as("months");
    const isSixMonthsAgoFromNow = monthsPassedSinceBillStarted >= 3 && monthsPassedSinceBillStarted < 6;

    if (!isSixMonthsAgoFromNow) return months; // Solo interesa los anteriores ultimos 3 meses de billos - Valores entre 2-5

    const index = months.findIndex(month => month.label.toLowerCase() === billDT.monthShort.toLowerCase())
    if (!months[index]) return months;

    months[index].bills.push(bill);

    return months;
  }, INITIAL_VALUE)

  return lastSixMonthsBills;
}

export const getLastSixMonthsBills = bills => {
  if (lodash.isEmpty(bills)) return [];
  const INITIAL_VALUE = LAST_SIX_MONTHS_LABELS.map(label => ({ label, bills: [] }))
  const lastSixMonthsBills = bills.reduce((months, bill) => {
    // Calculamos cuantos meses han pasado y para evitar cualquier mal calculo ponemos el mismo dia a ambos DateTimes
    const billDT = DateTime.fromFormat(bill.date, "dd/MM/yyyy").setLocale("es-ES").startOf("month");
    const monthsPassedSinceBillStarted = todayDT.startOf("month").diff(billDT.startOf("month")).as("months");
    const isSixMonthsAgoFromNow = monthsPassedSinceBillStarted >= 0 && monthsPassedSinceBillStarted < 6;

    if (!isSixMonthsAgoFromNow) return months; // Solo interesa los ultimos 6 meses de billos - Valores entre 0-5

    const index = months.findIndex(month => month.label.toLowerCase() === billDT.monthShort.toLowerCase())
    if (!months[index]) return months;

    months[index].bills.push(bill);

    return months;
  }, INITIAL_VALUE)

  return lastSixMonthsBills;
}

export const getFormerLastSixMonthsBills = bills => {
  if (lodash.isEmpty(bills)) return [];
  const INITIAL_VALUE = FORMER_LAST_SIX_MONTHS_LABELS.map(label => ({ label, bills: [] }))
  const lastSixMonthsBills = bills.reduce((months, bill) => {
    // Calculamos cuantos meses han pasado y para evitar cualquier mal calculo ponemos el mismo dia a ambos DateTimes
    const billDT = DateTime.fromFormat(bill.date, "dd/MM/yyyy").setLocale("es-ES").startOf("month");
    const monthsPassedSinceBillStarted = todayDT.startOf("month").diff(billDT.startOf("month")).as("months");
    const isSixMonthsAgoFromNow = monthsPassedSinceBillStarted >= 6 && monthsPassedSinceBillStarted < 12;

    if (!isSixMonthsAgoFromNow) return months; // Solo interesa los anteriores ultimos 6 meses de billos - Valores entre 6-11

    const index = months.findIndex(month => month.label.toLowerCase() === billDT.monthShort.toLowerCase())
    if (!months[index]) return months;

    months[index].bills.push(bill);

    return months;
  }, INITIAL_VALUE)

  return lastSixMonthsBills;
}

export const getInventoryStock = inventoryRecords => {
  if (lodash.isEmpty(inventoryRecords)) return [];

  const stocks = inventoryRecords.reduce((stocks, record) => {
    if (!record.onStock) return stocks; // If it has 0 on stock

    const key = record.product.name;
    if (stocks.has(key)) stocks.set(key, [...stocks.get(key), record])
    else stocks.set(key, record);

    return stocks;

  }, new Map())

  return stocks
}

export const getInventoryGroupedByClass = inventory => {
  return inventory.reduce((groups, { product }) => {
    if (!product.typeClass) return groups;

    return {
      ...groups,
      [product.typeClass]: [...groups[product.typeClass], product]
    }
  }, {
    A: [],
    B: [],
    C: [],
    U: [],
  })
}

export const getInventoryByWeekNumber = (records, weekNumber) => {
  if (lodash.isEmpty(records) || !weekNumber) return []

  const weekDT = todayDT.set({ weekNumber }).startOf("week");
  const nextWeekDT = todayDT.set({ weekNumber }).plus({ weeks: 1 }).startOf("week");

  const filteredInventory = records.filter(record => {
    const recordDT = DateTime.fromFormat(record.entryDate, "dd/MM/yyyy");
    const isFromTheWeekNumber = recordDT.diff(weekDT).as("milliseconds") > 0 && recordDT.diff(nextWeekDT).as("milliseconds") < 0;
    return isFromTheWeekNumber;
  })

  return filteredInventory;
}

export const getLastThreeMonthsInventory = records => {
  if (lodash.isEmpty(records)) return [];
  const INITIAL_VALUE = LAST_THREE_MONTHS_LABELS.map(label => ({ label, records: [] }))
  const lastSixMonthsInventory = records.reduce((months, record) => {
    // Calculamos cuantos meses han pasado y para evitar cualquier mal calculo ponemos el mismo dia a ambos DateTimes
    const recordDT = DateTime.fromFormat(record.entryDate, "dd/MM/yyyy").setLocale("es-ES").startOf("month");
    const monthsPassedSinceRecordStarted = todayDT.startOf("month").diff(recordDT.startOf("month")).as("months");
    const isSixMonthsAgoFromNow = monthsPassedSinceRecordStarted >= 0 && monthsPassedSinceRecordStarted < 3;

    if (!isSixMonthsAgoFromNow) return months; // Solo interesa los ultimos 3 meses de recordos - Valores entre 0-2

    const index = months.findIndex(month => month.label.toLowerCase() === recordDT.monthShort.toLowerCase())
    if (!months[index]) return months;

    months[index].records.push(record);

    return months;
  }, INITIAL_VALUE)

  return lastSixMonthsInventory;
}

export const getFormerLastThreeMonthsInventory = records => {
  if (lodash.isEmpty(records)) return [];
  const INITIAL_VALUE = FORMER_LAST_THREE_MONTHS_LABELS.map(label => ({ label, records: [] }))
  const lastSixMonthsInventory = records.reduce((months, record) => {
    // Calculamos cuantos meses han pasado y para evitar cualquier mal calculo ponemos el mismo dia a ambos DateTimes
    const recordDT = DateTime.fromFormat(record.entryDate, "dd/MM/yyyy").setLocale("es-ES").startOf("month");
    const monthsPassedSinceRecordStarted = todayDT.startOf("month").diff(recordDT.startOf("month")).as("months");
    const isSixMonthsAgoFromNow = monthsPassedSinceRecordStarted >= 3 && monthsPassedSinceRecordStarted < 6;

    if (!isSixMonthsAgoFromNow) return months; // Solo interesa los anteriores ultimos 3 meses de recordos - Valores entre 2-5

    const index = months.findIndex(month => month.label.toLowerCase() === recordDT.monthShort.toLowerCase())
    if (!months[index]) return months;

    months[index].records.push(record);

    return months;
  }, INITIAL_VALUE)

  return lastSixMonthsInventory;
}

export const getLastSixMonthsInventory = records => {
  if (lodash.isEmpty(records)) return [];
  const INITIAL_VALUE = LAST_SIX_MONTHS_LABELS.map(label => ({ label, records: [] }))
  const lastSixMonthsInventory = records.reduce((months, record) => {
    // Calculamos cuantos meses han pasado y para evitar cualquier mal calculo ponemos el mismo dia a ambos DateTimes
    const recordDT = DateTime.fromFormat(record.entryDate, "dd/MM/yyyy").setLocale("es-ES").startOf("month");
    const monthsPassedSinceRecordStarted = todayDT.startOf("month").diff(recordDT.startOf("month")).as("months");
    const isSixMonthsAgoFromNow = monthsPassedSinceRecordStarted >= 0 && monthsPassedSinceRecordStarted < 6;

    if (!isSixMonthsAgoFromNow) return months; // Solo interesa los ultimos 6 meses de recordos - Valores entre 0-5

    const index = months.findIndex(month => month.label.toLowerCase() === recordDT.monthShort.toLowerCase())
    if (!months[index]) return months;

    months[index].records.push(record);

    return months;
  }, INITIAL_VALUE)

  return lastSixMonthsInventory;
}

export const getFormerLastSixMonthsInventory = records => {
  if (lodash.isEmpty(records)) return [];
  const INITIAL_VALUE = FORMER_LAST_SIX_MONTHS_LABELS.map(label => ({ label, records: [] }))
  const lastSixMonthsInventory = records.reduce((months, record) => {
    // Calculamos cuantos meses han pasado y para evitar cualquier mal calculo ponemos el mismo dia a ambos DateTimes
    const recordDT = DateTime.fromFormat(record.entryDate, "dd/MM/yyyy").setLocale("es-ES").startOf("month");
    const monthsPassedSinceRecordStarted = todayDT.startOf("month").diff(recordDT.startOf("month")).as("months");
    const isSixMonthsAgoFromNow = monthsPassedSinceRecordStarted >= 6 && monthsPassedSinceRecordStarted < 12;

    if (!isSixMonthsAgoFromNow) return months; // Solo interesa los anteriores ultimos 6 meses de recordos - Valores entre 6-11

    const index = months.findIndex(month => month.label.toLowerCase() === recordDT.monthShort.toLowerCase())
    if (!months[index]) return months;

    months[index].records.push(record);

    return months;
  }, INITIAL_VALUE)

  return lastSixMonthsInventory;
}


export const getProductsRotationPercentage = records => {
  if (lodash.isEmpty(records)) return [];

  const rotations = records.reduce((rotations, record) => {
    const { product, shipped, onStock } = record;

    if (rotations.has(product._id)) {
      rotations.set(product._id, {
        ...rotations.get(product._id),
      })
    } else {

      rotations.set(product._id, {
        product: {
          _id: product._id,
          name: product.name,
          code: product.code,
          type: product.type,
          typeClass: product.typeClass,
        },
        shipped: shipped.length,
        ordered: onStock,
      })
    }

    return rotations;
  }, new Map())
}

export const sortOrdersOverview = orders => {
  return orders.sort((a, b) => {
    const diff = DateTime.fromFormat(b.date, "dd/MM/yyyy").diff(DateTime.fromFormat(a.date, "dd/MM/yyyy")).as("milliseconds");
    if (diff < 0) return -1
    else if (diff > 0) return 1
    else return 0
  });
}