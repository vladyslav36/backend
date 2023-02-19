const User = require('../models/userModel')
const asyncHandler=require('express-async-handler')
const vBot=require('../index')



exports.login = asyncHandler(async (req, res) => {
  const { authKey, authMethod } = req.body    
  const user = await User.findOne({ authKey, authMethod })  
  if (user) {    
    res.status(200).json( user )
  } else {
    res.status(401)
      throw new Error ("Пользователь не найден")
  }
  
})



exports.updateUser = asyncHandler(async (req, res) => {
  const { delivery,userPhone } = req.body
  const id=req.user._id
  const user = await User.findById(id)
  user.delivery=delivery
  user.phone = userPhone
  const newUser = await user.save()  
  res.status(200).json(newUser)
  
})


