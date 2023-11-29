const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
  code: {
    type: String,
    unique: true,
    required: false,
  },
  product: {
    _id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    code: {
      type: String,
      required: true,
    },
    slot: {
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
  billRef: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Bill',
    required: true,
  },
  shipped: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Shipping',
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
  observations: {
    type: String,
    required: false,
  }
});

// We remove sensitive data when sending it through our API to the client.
inventorySchema.set('toJSON', {
  transform: function (doc, ret, opt) {
    delete ret.__v;
  }
});


// Conecta inventorySchema con "inventory" colleccion
module.exports = mongoose.model('Inventory', inventorySchema);
