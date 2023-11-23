const bills = require("./bills.mongo");

const getBills = async () => {
  return await bills.find().populate("provider");
}

const getBillById = async (billId) => {
  return await bills.findById(billId).populate("provider");
}

const createBill = async (billData) => {
  return await bills.create(billData);
}

const updateBillById = async (billId, billData) => {
  return await bills.findByIdAndUpdate(billId, billData);
}

const deleteBillById = async (billId) => {
  return await bills.findByIdAndDelete(billId);
}

// @bundle: Array[Object{Bill}]
// Recibe un array de objetos donde crea un key con los matchfields para encontrarlo en la coleccion
const upsertBillsByBundle = async (bundle) => {
  return await bills.upsertMany(bundle, {
    matchFields: ['_id'], // Compara los docs mediante este campo
    ensureModel: true, // Valida la data por el Schema
  });
}

module.exports = {
  getBills,
  getBillById,
  createBill,
  updateBillById,
  deleteBillById,
  upsertBillsByBundle
};