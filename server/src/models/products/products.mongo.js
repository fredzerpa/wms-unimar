const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: true,
  },
  code: {
    type: String,
    unique: true,
    required: true,
  },
  slot: {
    type: String,
    unique: true,
    required: true,
  },
});

// We remove sensitive data when sending it through our API to the client.
productSchema.set('toJSON', {
  transform: function (doc, ret, opt) {
    delete ret.__v;
  }
});

// Conecta productSchema con "products" colleccion
module.exports = mongoose.model('Product', productSchema);
