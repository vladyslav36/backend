const jwt = require("jsonwebtoken")
const User = require("../models/userModel")
const asyncHandler = require("express-async-handler")

exports.protect = asyncHandler(async (req, res, next) => {
  let token

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1]
      const decoded = jwt.verify(token, process.env.TOKEN_SECRET)
      req.user = await User.findById(decoded.id).select("-password")      
      next()
    } catch (error) {
      console.error(error.message)
      res.status(401)
      throw new Error("No authorization, token failed")
    }
  }

  if (!token) {
    res.status(401)
    throw new Error("No token, no authorization")
  }
})

exports.protectAdmin = asyncHandler(
  async (req, res, next) => {   
    if (!req.user.isAdmin) throw new Error('Access denied')
    next()
  }
)