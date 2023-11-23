const bcrypt = require('bcryptjs');
const formData = require('form-data-to-object');

/* 
  Converts a String property of an object to a scheme
  ej: 
  { 'user.name': 'John', 'user.lastname': 'Doe' } => { user: { name: 'John', lastname: 'Doe' } }
*/
const convertObjectStringToSchema = (stringObj = {}, divider = '.') => {
  // Registro del Schema
  const schema = new Map();

  // Obtener una matriz de los props y values del objeto
  const entries = Object.entries(stringObj);
  // Separamos los props por el divider para obtener
  // el main path y los subpaths en un array y la data (value) en otro (una matriz [[path, ...subpaths], [value]])
  const entriesSplitted = entries.map(([key, value]) => [
    key.split(divider),
    value,
  ]);

  // Por cada data de la matriz
  entriesSplitted.forEach(([paths, data]) => {
    // Separamos el Path actual y los Sub-Paths que posea
    const [path, ...subPaths] = paths;
    // Vemos si su Path actual existe en el Schema y si no lo creamos
    if (!schema.has(path)) schema.set(path, data);
    // A su vez si el Path actual posee Sub-Paths los agregamos como un Nested Object
    if (subPaths.length) {
      // El Schema en el Path actual puede ser un Nested Object o un String
      typeof schema.get(path) === 'object'
        ? // Si es un Nested Object incluimos los Sub-Paths preexistentes y creamos un nuevo Sub-Path con la data como value
        schema.set(path, {
          ...schema.get(path),
          [subPaths.join(divider)]: data,
        })
        : // Si es un String creamos un nuevo Sub-Path con la data como value
        schema.set(path, {
          [subPaths.join(divider)]: data,
        });
    }
  });

  // El Schema Map lo convertimos en un Schema Objeto
  return [...schema].reduce((result, [path, rest]) => {
    // Si la data del Path actual es un Nested Object
    if (typeof rest === 'object') {
      // Verificamos si esa data es un String Prop del Nested Object
      // Que se puede convetir en un Sub-Path
      const hasSubpaths = Object.entries(rest).some(
        ([subPath, data]) => subPath.split(divider).length > 1
      );
      hasSubpaths
        ? // Si posee un Sub-Path realizamos una cursividad
        // Para transformar ese Sub-Path
        (result[path] = convertObjectStringToSchema(rest))
        : // Si no posee un Sub-Path retornamos
        (result[path] = rest);
    } else {
      // Si no es un Nested Object, es un String y lo agregamos asi
      result[path] = rest;
    }

    // Retornamos nuestro Schema Object
    return result;
  }, {});
}

const removeFile = (filePath) => {
  try {
    fs.unlinkSync(filePath);

    return {
      ok: true,
      file: filePath,
    }
  } catch (err) {
    return {
      ok: false,
      file: filePath,
      error: err,
    }
  }

}

const formDataToObj = (data) => {
  const formattedFormData = Object.fromEntries(Object.entries(data).map(([key, value]) => {
    try {
      return [key, JSON.parse(value)]
    } catch (error) {
      return [key, value]
    }
  }))

  return formData.toObj(formattedFormData);
}

const encrypt = async (data) => {
  return await bcrypt.hash(String(data), Number(process.env.BCRYPT_SALT)); // bcrypt only hashes Strings
}

module.exports = {
  convertObjectStringToSchema,
  removeFile,
  formDataToObj,
  encrypt,
};
