const shippings = require('./shippings.mongo');

const getShippings = async () => {
  return await shippings.find().populate('store');
}

const getShippingById = async (shippingId) => {
  return await shippings.findById(shippingId).populate('store');
}

const createShipping = async (shippingData) => {
  return await shippings.create(shippingData);
}

const updateShippingById = async (shippingId, shippingData) => {
  return await shippings.findByIdAndUpdate(shippingId, shippingData);
}

const deleteShippingById = async (shippingId) => {
  return await shippings.findByIdAndDelete(shippingId);
}

// @bundle: Array[Object{Shipping}]
// Recibe un array de objetos donde crea un key con los matchfields para encontrarlo en la coleccion
const upsertShippingsByBundle = async (bundle) => {
  return await shippings.upsertMany(bundle, {
    matchFields: ['_id'], // Compara los docs mediante este campo
    ensureModel: true, // Valida la data por el Schema
  });
}

module.exports = {
  getShippings,
  getShippingById,
  createShipping,
  updateShippingById,
  deleteShippingById,
  upsertShippingsByBundle,
};