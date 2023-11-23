const mongoose = require('mongoose');
const addressSchema = require('../schemas/addresses.schema');

const storeSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: true,
  },
  phone: {
    type: String,
    required: false,
  },
  address: {
    type: addressSchema,
    required: false,
  }
});

// Conecta storeSchema con "stores" colleccion
module.exports = mongoose.model('Store', storeSchema);
