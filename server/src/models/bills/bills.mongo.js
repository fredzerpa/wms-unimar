const mongoose = require('mongoose');
const { customAlphabet } = require("nanoid");
const nanoid = customAlphabet("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ", 12)

const amountSchema = require('../schemas/amounts.schema');

const billSchema = new mongoose.Schema({
  code: {
    type: String,
    required: false,
    unique: true,
  },
  provider: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Provider",
    required: true,
  },
  products: [{
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
    quantity: {
      type: Number,
      required: true,
    },
    unitCost: {
      type: amountSchema,
      required: true,
    },
    discount: {
      type: amountSchema,
      required: true,
    },
    subtotal: {
      type: amountSchema,
      required: true,
    },
  }],
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

billSchema.pre('save', async function (next) {
  // We only encrypt the key if it has been modified or is new.
  if (!this.isModified('code')) return next();

  try {
    this.code = nanoid();
    return next();
  } catch (err) {
    return next(err);
  }
});

// Conecta billSchema con "bill" colleccion
module.exports = mongoose.model('Bill', billSchema);
