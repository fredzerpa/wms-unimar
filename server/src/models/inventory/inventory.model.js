const inventory = require('./inventory.mongo');


const getInventoryRecords = async () => {
  return await inventory.find().populate(['billRef', 'shipped']);
}

const getInventoryRecordById = async (recordId) => {
  return await inventory.findById(recordId).populate(['billRef', 'shipped']);
}

const getInventoryRecordsByProductId = async (productId) => {
  return await inventory.find({ 'product._id': productId }).populate(['billRef', 'shipped']);
}

const getInventoryRecordsByShippingId = async (shippingId) => {
  return await inventory.find({ shipped: shippingId }).populate(['billRef', 'shipped']);
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

const deleteInventoryRecordsByFilter = async (filter) => {
  return await inventory.deleteMany(filter);
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
const upsertInventoryRecordsByFields = async (bundle, fields = ['_id']) => {
  return await inventory.upsertMany(bundle, {
    matchFields: fields, // Compara los docs mediante este campo
    ensureModel: true, // Valida la data por el Schema
  });
}


module.exports = {
  getInventoryRecords,
  getInventoryRecordById,
  getInventoryRecordsByProductId,
  getInventoryRecordsByShippingId,
  createInventoryRecord,
  updateInventoryRecordById,
  deleteInventoryRecordById,
  deleteInventoryRecordsByFilter,
  upsertInventoryRecords,
  upsertInventoryRecordsByFields,
};