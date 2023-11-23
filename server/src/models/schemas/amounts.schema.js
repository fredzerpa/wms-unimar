const mongoose = require('mongoose');

const amountSchema = new mongoose.Schema({
  _id: false, // New Schema creates _id property
  // Moneda Venezolana
  bs: {
    type: Number,
    required: false,
  },
  // Moneda de Estados Unidos
  usd: {
    type: Number,
    required: false,
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
});
module.exports = amountSchema;
