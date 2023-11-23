const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
  product: {
    name: {
      type: String,
      required: true,
    },
    code: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    typeClass: {
      type: String,
      required: false, // Can be null because of the "type" "industrialAndMarine"
    },
    size: {
      type: String,
      required: true,
    },
  },
  onStock: {
    type: Number,
    required: true,
  },
  shipped: {
    type: [mongoose.Schema.Types.ObjectId],
    required: false,
    default: [],
  },
  entryDate: {
    type: String,
    required: true,
  },
  expirationDate: {
    type: String,
    required: false,
  },
  slot: {
    type: String,
    required: true,
  },
  observations: {
    type: String,
    required: false,
  }
});

// Conecta inventorySchema con "inventory" colleccion
module.exports = mongoose.model('Inventory', inventorySchema);
