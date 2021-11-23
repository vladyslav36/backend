const Product = require('../models/productModel')
const Category = require('../models/categoryModel')
const asyncHandler=require('express-async-handler')


  
exports.getProductsModels = asyncHandler(async (req, res) => {
  const  string  = req.query.string.trim()
  const data = await Product.find({
    model: { $regex: string, $options: "i" },
  }).limit(10)
  const list = data.map((item) => item.model)
  res.status(200).json({ list })
}) 
exports.getProductsNames = asyncHandler(async (req, res) => {
  const  string  = req.query.string.trim()
  const data = await Product.find({
    name: { $regex: string, $options: "i" },
  }).limit(10)
  const list = data.map((item) => item.name)
  res.status(200).json({ list })
}) 
exports.getCategories = asyncHandler(async (req, res) => {
   const string = req.query.string.trim()
  const data = await Category.find({
    name: { $regex: string, $options: "i" },
  }).limit(10)
  const list = data.map((item) => item.name)
  res.status(200).json({ list })
}) 