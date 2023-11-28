const mongoose = require('mongoose');
const amountSchema = require('../schemas/amounts.schema');

const billSchema = new mongoose.Schema({
  code: {
    type: String,
    required: false,
    unique: true,
  },
  provider: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Provider',
    required: true,
  },
  products: {
    type: [{
      inventoryRefId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Inventory',
        required: false,
      },
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
        required: false, // Can be null because of the 'type' 'industrialAndMarine'
      },
      size: {
        type: String,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
      unitCost: {
        type: amountSchema,
        required: true,
      },
      discount: {
        type: Number, // Represents de discount percentage in number
        required: false,
        default: 0,
      },
      subtotal: {
        type: amountSchema,
        required: true,
      },
      expirationDate: {
        type: String,
        required: true,
      },
    }],
    default: [],
  },
  convertionRate: {
    rate: {
      type: Number,
      required: false,
    },
    // Dependiendo del dia el valor de la moneda fluctua (inflacion)
    date: {
      type: String,
      required: false,
    },
  },
  total: {
    type: amountSchema,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
});

// We remove sensitive data when sending it through our API to the client.
billSchema.set('toJSON', {
  transform: function (doc, ret, opt) {
    delete ret.__v;
  }
});

// Conecta billSchema con 'bill' colleccion
module.exports = mongoose.model('Bill', billSchema);
