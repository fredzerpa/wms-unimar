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

// We remove sensitive data when sending it through our API to the client.
providerSchema.set('toJSON', {
  transform: function (doc, ret, opt) {
    delete ret.__v;
  }
});

// Conecta providerSchema con "providers" colleccion
module.exports = mongoose.model('Provider', providerSchema);
