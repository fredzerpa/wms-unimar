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
});

// Conecta productSchema con "products" colleccion
module.exports = mongoose.model('Product', productSchema);
