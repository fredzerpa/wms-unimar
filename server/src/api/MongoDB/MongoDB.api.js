const path = require('path');
const { DateTime } = require('luxon');
const execSync = require('child_process').execSync;

const DUMP_INITIAL_OPTIONS = {
  filePrefix: '', // Si solo se usa el prefix se agregara un sufijo de la fecha actual en formato ISO
  fileFullname: null, // Reemplaza el nombre completo del archivo a crear
  pathToDumpFolder: null, // Si es nulo se creara el backup en el mismo directorio
  database: '',
  config: path.join(__dirname, 'config.yaml'), // ref: https://www.mongodb.com/docs/database-tools/mongorestore/#std-option-mongorestore.--archive
}

// Estos son 'dumps' son temporales, ya que el backup se guarda en AWS S3
// ! config es obligatorio. ref: https://www.mongodb.com/docs/database-tools/mongodump/#std-option-mongodump.--config
// ! dumpDatabase es una funcion sincrona, por lo que parara todos los procesos hasta terminar
function dumpDatabase(dumpOptions = DUMP_INITIAL_OPTIONS) {
  const options = { ...DUMP_INITIAL_OPTIONS, ...dumpOptions };

  const DUMP_NAME = options.fileFullname ?? `${options.filePrefix}-${DateTime.now().toISODate()}.archive.gz`;
  const DUMP_PATH = path.join(options.pathToDumpFolder ?? '', DUMP_NAME);
  const cmd = `mongodump --config="${options.config}" --db ${options.database} --archive="${DUMP_PATH}" --gzip --quiet`;

  try {
    execSync(cmd);
    return {
      ok: true,
      data: {
        fileName: DUMP_NAME,
        filePath: DUMP_PATH,
      }
    }
  } catch (err) {
    return {
      ok: false,
      error: err
    }
  }

}

const RESTORE_INITIAL_OPTIONS = {
  filePath: '', // Nombre completo (incluyendo la ruta) del archivo. Ex: 'el-angel-2023-01-01'
  // ! Confirmar las autorizaciones del usuario para insertar documentos en la BD
  config: path.join(__dirname, 'config.yaml'), // ref: https://www.mongodb.com/docs/database-tools/mongorestore/#std-option-mongorestore.--archive
}

async function restoreDatabase(restoreOptions = RESTORE_INITIAL_OPTIONS) {
  const options = { ...RESTORE_INITIAL_OPTIONS, ...restoreOptions };

  const RESTORE_FILE_PATH = options.filePath.includes('.archive.gz') ? options.filePath : `${options.filePath}.archive.gz`;
  const cmd = `mongorestore --config="${options.config}" --archive="${RESTORE_FILE_PATH}" --gzip`;

  try {
    execSync(cmd);
    return {
      ok: true,
    }
  } catch (err) {
    return {
      ok: false,
      error: err
    }
  }
}

module.exports = {
  dumpDatabase,
  restoreDatabase,
}