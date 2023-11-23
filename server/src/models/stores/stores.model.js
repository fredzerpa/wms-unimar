const stores = require("./stores.mongo");

const getStores = async () => {
  return await stores.find();
}

const getStoreById = async (storeId) => {
  return await stores.findById(storeId);
}

const createStore = async (storeData) => {
  return await stores.create(storeData);
}

const updateStoreById = async (storeId, storeData) => {
  return await stores.findByIdAndUpdate(storeId, storeData);
}

const deleteStoreById = async (storeId) => {
  return await stores.findByIdAndDelete(storeId);
}

// @bundle: Array[Object{Store}]
// Recibe un array de objetos donde crea un key con los matchfields para encontrarlo en la coleccion
const upsertStoresByBundle = async (bundle) => {
  return await stores.upsertMany(bundle, {
    matchFields: ['_id'], // Compara los docs mediante este campo
    ensureModel: true, // Valida la data por el Schema
  });
}

module.exports = {
  getStores,
  getStoreById,
  createStore,
  updateStoreById,
  deleteStoreById,
  upsertStoresByBundle,
};