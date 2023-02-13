// const mongoose = require("mongoose")
// const bcrypt=require('bcrypt')

// const userSchema = mongoose.Schema(
//   {
//     name: {
//       type: String,
//       required: true,
//     },
//     email: {
//       type: String,
//       required: true,
//       unique: true,
//     },
//     password: {
//       type: String,
//       required: true,
//     },
   
    

//     authKey: String,
//     authMethod: String,
//     token: String,
//     userId: String,
//     userName: String,
//     isAdmin: {
//       type: Boolean,
//       default: false,
//     },
//     
//     phone: String,
//     delivery: {
//       name: String,
//       surname: String,
//       phone: String,
//       city: String,
//       carrier: String,
//       branch: String,
//       pickup: { type: Boolean, default: true },
//       prepaid: { type: Boolean, default: true },
//     },
//   },
//   {
//     timestamps: true,
//     minimize: false,
//   }
// )

// userSchema.methods.matchPassword = async function (enteredPassword) {
//   return await bcrypt.compare(enteredPassword,this.password)
// }
// userSchema.pre('save', async function (next) {
//   if (!this.isModified('password')) {
//     next()
//   }
//   const salt =await  bcrypt.genSalt(10)
//   this.password=await bcrypt.hash(this.password,salt)
// })
// const User = mongoose.model("User", userSchema)

// module.exports = User

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

const User = mongoose.model("User_test", userSchema)

module.exports = User
