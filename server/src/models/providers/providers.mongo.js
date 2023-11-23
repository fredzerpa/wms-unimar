const mongoose = require('mongoose');
const documentsIdSchema = require('../schemas/documentsId.schema');

const providerSchema = new mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: true,
  },
  phone: {
    type: String,
    required: false,
  },
  documentId: {
    type: documentsIdSchema,
    required: true,
  },
});

// Conecta providerSchema con "providers" colleccion
module.exports = mongoose.model('Provider', providerSchema);
