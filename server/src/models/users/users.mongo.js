const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const phonesSchema = require('../schemas/phones.schema');

const userSchema = new mongoose.Schema({
  imageUrl: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  names: {
    type: String,
    required: true,
  },
  lastnames: {
    type: String,
    required: true,
  },
  fullname: {
    type: String,
    required: true,
  },
  phones: phonesSchema,
  isAdmin: {
    type: Boolean,
    default: false,
    required: true,
  },
  privileges: {
    reports: {
      read: {
        type: Boolean,
        default: true,
        required: true,
      },
    },
    users: {
      read: {
        type: Boolean,
        default: true,
        required: true,
      },
      upsert: {
        type: Boolean,
        default: false,
        required: true,
      },
      delete: {
        type: Boolean,
        default: false,
        required: true,
      },
    },
    inventory: {
      read: {
        type: Boolean,
        default: true,
        required: true,
      },
      upsert: {
        type: Boolean,
        default: false,
        required: true,
      },
      delete: {
        type: Boolean,
        default: false,
        required: true,
      },
    },
    shippings: {
      read: {
        type: Boolean,
        default: true,
        required: true,
      },
      upsert: {
        type: Boolean,
        default: false,
        required: true,
      },
      delete: {
        type: Boolean,
        default: false,
        required: true,
      },
    },
    billing: {
      read: {
        type: Boolean,
        default: true,
        required: true,
      },
      upsert: {
        type: Boolean,
        default: false,
        required: true,
      },
      delete: {
        type: Boolean,
        default: false,
        required: true,
      },
    },
  },
});

userSchema.pre('save', async function (next) {
  // We only encrypt the key if it has been modified or is new.
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(Number(process.env.BCRYPT_SALT));
    this.password = await bcrypt.hash(String(this.password), salt); // bcrypt only use strings
    return next();
  } catch (err) {
    return next(err);
  }
});

userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(String(password), this.password) // bcrypt only compares strings
}

// We remove sensitive data when sending it through our API to the client.
userSchema.set('toJSON', {
  transform: function (doc, ret, opt) {
    delete ret.password;
    delete ret._id;
    delete ret.__v;
  }
});

// Conecta userSchema con "Users" colleccion
module.exports = mongoose.model('User', userSchema);
