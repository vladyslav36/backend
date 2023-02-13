const User = require('../models/userModel')
const asyncHandler=require('express-async-handler')
const generateToken = require('../utils/generateToken')

// exports.userAuth = asyncHandler(async (req, res) => {

//   const { email, password } = req.body
  
//   const user = await User.findOne({ email })
//   if (user && (await user.matchPassword(password))) {
//     res.json({
//       _id: user._id,
//       name: user.name,
//       email: user.email,
//       isAdmin: user.isAdmin,
//       token:generateToken(user._id)
//     })
//   } else {
//     res.status(401)    
//     throw new Error('Неправильный логин или пароль')
//   }
// })

exports.login = asyncHandler(async (req, res) => {
  const { authKey, authMethod } = req.body  
  const user = await User.findOne({ authKey,authMethod })
  if (user) {
    res.status(200).json( user )
  } else {
    res.status(401)
      throw new Error ("Пользователь не найден")
  }
  
})


// exports.registerUser = asyncHandler(async (req, res) => {
//   const { name, email, password } = req.body
//   const userExists = await User.findOne({ email })
  
//   if (userExists) {
//     res.status(400)
//     throw new Error('User already exists')
//   } 
//     const user = await User.create({
//     name:name.trim(),
//     email:email.trim(),
//     password:password.trim()
//   })
  
//   if (user) {
//     res.status(201).json({
//       _id: user._id,
//       name: user.name,
//       email: user.email,
//       isAdmin: user.isAdmin,
//       token: generateToken(user._id),
//     })
//   } else {
//     res.status(400)
//     throw new Error('Invalid data')
//   }
  
  
  
// })


// exports.updateUser = asyncHandler(async (req, res) => {
//   const { name, email, password,id } = req.body
//   const user = await User.findById(id)
//   user.name = name
//   user.email = email
//   if (password) {
//     user.password=password
//   }
  
//   const newUser=await user.save()
    
  
  
//   res.status(200).json({
//     _id: newUser._id,
//     name: newUser.name,
//     email: newUser.email,
//     isAdmin: newUser.isAdmin,
//     token:generateToken(newUser._id)
//   })
  
// })
exports.updateUser = asyncHandler(async (req, res) => {
  const { delivery,userPhone } = req.body
  const id=req.user._id
  const user = await User.findById(id)
  user.delivery=delivery
  user.phone = userPhone
  const newUser = await user.save()  
  res.status(200).json(newUser)
  
})


// exports.getUserProfile = asyncHandler(async (req, res) => {
//   const user=await User.findById(req.user._id)
//   if (user) {
//     res.status(200).json({
//       _id: user._id,
//       name: user.name,
//       email: user.email,
//       isAdmin:user.isAdmin
//     })
//   } else {
//     res.status(404)
//     throw new Error('User not found')
//   }
  
// })