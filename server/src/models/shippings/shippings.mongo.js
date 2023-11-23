const mongoose = require('mongoose');
const { customAlphabet } = require("nanoid");
const nanoid = customAlphabet("0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ", 12)


const shippingSchema = new mongoose.Schema({
  code: {
    type: String,
    required: false,
    unique: true,
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
    }
  }],
  status: {
    type: String,
    required: true,
  },
  store: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Store'
  },
  date: {
    type: String,
    required: true,
  },
});

shippingSchema.pre('save', async function (next) {
  // We only encrypt the key if it has been modified or is new.
  if (!this.isModified('code')) return next();

  try {
    this.code = nanoid();
    return next();
  } catch (err) {
    return next(err);
  }
});

// Conecta shippingSchema con "shipping" colleccion
module.exports = mongoose.model('Shipping', shippingSchema);
