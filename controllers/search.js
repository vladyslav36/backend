const Product = require('../models/productModel')
const Category = require('../models/categoryModel')
const asyncHandler=require('express-async-handler')



  
exports.getProductsModels = asyncHandler(async (req, res) => {
    
  const {string,name,categoryId,brandId} = req.body
  // Убираем пустышки 
  const searchObj = {}
  if (name) searchObj.name=name
  if (categoryId) searchObj.categoryId=categoryId
  if (brandId) searchObj.brandId = brandId
  const data = await Product.find({
    model: { $regex: string, $options: "i" },
    ...searchObj
  }).limit(10)
  const list = data.map((item) =>({name:item.model,id:item._id}))
  res.status(200).json({ list })
}) 
exports.getProductsNames = asyncHandler(async (req, res) => {
  const { string, model, categoryId, brandId } = req.body
   // Убираем пустышк
   const searchObj = {}
    if (model) searchObj.model = model
    if (categoryId) searchObj.categoryId = categoryId
    if (brandId) searchObj.brandId = brandId
  const data = await Product.find({
    name: { $regex: string, $options: "i" },
    ...searchObj
  }).limit(10)
  const list = data.map((item) => ({ name: item.name, id: item._id }))
  res.status(200).json({ list })
}) 
exports.getCategories = asyncHandler(async (req, res) => {
  
  const {brandId,string} = req.body
  // Убираем пустышки 
  const searchObj = {}  
  if (brandId) searchObj.brandId = brandId 
  const data = await Category.find({
    name: { $regex: string, $options: "i" },...searchObj
  })
  const list = data.map((item) => ({ name: item.name, id: item._id }))
  res.status(200).json({ list })
}) 
exports.getBrands = asyncHandler(async (req, res) => {
  const { string }=req.body 
  const data = await Category.find({
    name: { $regex: string, $options: "i" },
    parentCategoryId: null
    
  })  
  
  const list = data.map((item) => ({ name: item.name, id: item._id }))
  res.status(200).json({list })
}) 

// В поиске реализован следующий принцип:выпадающий список модель(name) и артикул (model) ищутся в зависимости от бренда(brandId) и категории(categoryId)
// Список категории ищется только в зависимости от выбранного бренда, список бренда ни от чего не зависит и вываливается всегда весь