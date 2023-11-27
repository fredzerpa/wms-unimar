const inventory = require("./inventory.mongo");

const getInventoryRecords = async () => {
  return await inventory.find();
}

const getInventoryRecordById = async (recordId) => {
  return await inventory.findById(recordId);
}

const createInventoryRecord = async (recordData) => {
  return await inventory.create(recordData);
}

const updateInventoryRecordById = async (recordId, recordData) => {
  return await inventory.findByIdAndUpdate(recordId, recordData);
}

const deleteInventoryRecordById = async (recordId) => {
  return await inventory.findByIdAndDelete(recordId);
}

// @bundle: Array[Object{InventoryRecord}]
// Recibe un array de objetos donde crea un key con los matchfields para encontrarlo en la coleccion
const upsertInventoryRecords = async (bundle) => {
  return await inventory.upsertMany(bundle, {
    matchFields: ['_id'], // Compara los docs mediante este campo
    ensureModel: true, // Valida la data por el Schema
  });
}

// @bundle: Array[Object{InventoryRecord}]
// Recibe un array de objetos donde crea un key con los matchfields para encontrarlo en la coleccion
const upsertInventoryRecordsByFields = async (fields = ["_id"], bundle) => {
  return await inventory.upsertMany(bundle, {
    matchFields: fields, // Compara los docs mediante este campo
    ensureModel: true, // Valida la data por el Schema
  });
}


module.exports = {
  getInventoryRecords,
  getInventoryRecordById,
  createInventoryRecord,
  updateInventoryRecordById,
  deleteInventoryRecordById,
  upsertInventoryRecords,
  upsertInventoryRecordsByFields,
};