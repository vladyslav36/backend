const jwt=require('jsonwebtoken')
const User = require('../models/userModel')
const asyncHandler=require('express-async-handler')

exports.protect = asyncHandler(async (req, res, next) => {
  let token
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1]
      const decoded = jwt.verify(token, process.env.TOKEN_SECRET)
      const user = await User.findById(decoded.id).select("-password")
    if (!user.isAdmin) {
      res.status(401)
      throw new Error('No authorization,not admin')
    }
    req.user=user
     next() 
      
    } catch (error) {
      console.error(error.message)
      res.status(401)
      throw new Error('No authorization, token failed')
    }
    
  }
    
  

  if (!token) {
    res.status(401)
    throw new Error('No token, no authorization')
  }
  
})