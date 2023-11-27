const mongoose = require('mongoose');

const shippingSchema = new mongoose.Schema({
  code: {
    type: String,
    required: false,
    unique: true,
  },
  products: [{
    inventoryRefId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Inventory",
      required: false,
    },
    _id: {
      type: mongoose.Schema.Types.ObjectId,
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

// We remove sensitive data when sending it through our API to the client.
shippingSchema.set('toJSON', {
  transform: function (doc, ret, opt) {
    delete ret.__v;
  }
});


// Conecta shippingSchema con "shipping" colleccion
module.exports = mongoose.model('Shipping', shippingSchema);
