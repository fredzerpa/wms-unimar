const providers = require("./providers.mongo");

const getProviders = async () => {
  return await providers.find();
}

const getProviderById = async (providerId) => {
  return await providers.findById(providerId);
}

const createProvider = async (providerData) => {
  return await providers.create(providerData);
}

const updateProviderById = async (providerId, providerData) => {
  return await providers.findByIdAndUpdate(providerId, providerData);
}

const deleteProviderById = async (providerId) => {
  return await providers.findByIdAndDelete(providerId);
}

// @bundle: Array[Object{Provider}]
// Recibe un array de objetos donde crea un key con los matchfields para encontrarlo en la coleccion
const upsertProvidersByBundle = async (bundle) => {
  return await providers.upsertMany(bundle, {
    matchFields: ['_id'], // Compara los docs mediante este campo
    ensureModel: true, // Valida la data por el Schema
  });
}

module.exports = {
  getProviders,
  getProviderById,
  createProvider,
  updateProviderById,
  deleteProviderById,
  upsertProvidersByBundle,
};