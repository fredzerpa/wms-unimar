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

// We remove sensitive data when sending it through our API to the client.
storeSchema.set('toJSON', {
  transform: function (doc, ret, opt) {
    delete ret.__v;
  }
});


// Conecta storeSchema con "stores" colleccion
module.exports = mongoose.model('Store', storeSchema);
