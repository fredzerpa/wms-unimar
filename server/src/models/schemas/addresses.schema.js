const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
  _id: false, // New Schema creates _id property
  full: {
    type: String,
    required: false,
  },
  parts: {
    // House es referente al nombre o numero usado para identificar una casa/apartamento
    house: {
      type: String,
      required: false,
    },
    street: {
      type: String,
      required: false,
    },
    city: {
      type: String,
      required: false,
    },
    state: {
      type: String,
      required: false,
    },
    country: {
      type: String,
      required: false,
    },
    postalCode: {
      type: Number,
      required: false,
    },
  },
  geo: {
    lat: {
      type: Number,
      required: false,
    },
    lon: {
      type: Number,
      required: false,
    },
  },
});

module.exports = addressSchema;
