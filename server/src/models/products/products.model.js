const products = require("./products.mongo");

const getProducts = async () => {
  return await products.find();
}

const getProductById = async (productId) => {
  return await products.findById(productId);
}

const createProduct = async (productData) => {
  return await products.create(productData);
}

const updateProductById = async (productId, productData) => {
  return await products.findByIdAndUpdate(productId, productData);
}

const deleteProductById = async (productId) => {
  return await products.findByIdAndDelete(productId);
}

// @bundle: Array[Object{Product}]
// Recibe un array de objetos donde crea un key con los matchfields para encontrarlo en la coleccion
const upsertProductsByBundle = async (bundle) => {
  return await products.upsertMany(bundle, {
    matchFields: ['_id'], // Compara los docs mediante este campo
    ensureModel: true, // Valida la data por el Schema
  });
}

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProductById,
  deleteProductById,
  upsertProductsByBundle,
};