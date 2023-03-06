

const mongoose = require("mongoose")

const userSchema = mongoose.Schema(
  {
    authKey: String,
    authMethod: String,
    token: String,
    userId: String,
    userName: String,
    isAdmin: {
      type: Boolean,
      default: false,
    },

    phone: {
      type: String,
      default: "",
    },
    delivery: {
      name: {
        type: String,
        default: "",
      },
      surname: {
        type: String,
        default: "",
      },
      phone: {
        type: String,
        default: "",
      },
      city: {
        type: String,
        default: "",
      },
      carrier: {
        type: String,
        default: "",
      },
      branch: {
        type: String,
        default: "",
      },
      
    },
  },
  {
    timestamps: true,
    minimize: false,
  }
)
// in production mode         User UserDev
const User = mongoose.model('User', userSchema)

module.exports = User
