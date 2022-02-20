const Product = require('../models/productModel')
const Category = require('../models/categoryModel')
const asyncHandler=require('express-async-handler')



  
exports.getProductsModels = asyncHandler(async (req, res) => {
  const string = req.query.string  
  const values = req.body
  // Убираем пустышки и меняем category и brand нв categoryId и brandId
  const searchObj = {}
  if (values.name.id) searchObj.name=values.name.name
  if (values.category.id) searchObj.categoryId=values.category.id
  if (values.brand.id) searchObj.brandId = values.brand.id
  const data = await Product.find({
    model: { $regex: string, $options: "i" },
    ...searchObj
  }).limit(10)
  const list = data.map((item) =>({name:item.model,id:item._id}))
  res.status(200).json({ list })
}) 
exports.getProductsNames = asyncHandler(async (req, res) => {
  const string = req.query.string
   const values = req.body
   // Убираем пустышки и меняем category и brand нв categoryId и brandId
   const searchObj = {}
   if (values.model.id) searchObj.model = values.model.name
   if (values.category.id) searchObj.categoryId = values.category.id
   if (values.brand.id) searchObj.brandId = values.brand.id
  const data = await Product.find({
    name: { $regex: string, $options: "i" },
    ...searchObj
  }).limit(10)
  const list = data.map((item) => ({ name: item.name, id: item._id }))
  res.status(200).json({ list })
}) 
exports.getCategories = asyncHandler(async (req, res) => {
  const string = req.query.string
  const values = req.body
  // Убираем пустышки и меняем category и brand нв categoryId и brandId
  const searchObj = {}  
  if (values.brand.id) searchObj.brandId = values.brand.id  
  const data = await Category.find({
    name: { $regex: string, $options: "i" },...searchObj
  }).limit(10)
  const list = data.map((item) => ({ name: item.name, id: item._id }))
  res.status(200).json({ list })
}) 
exports.getBrands = asyncHandler(async (req, res) => {
  const string = req.query.string  
  const data = await Category.find({
    name: { $regex: string, $options: "i" },
    parentCategoryId: null
    
  })  
  
  const list = data.map((item) => ({ name: item.name, id: item._id }))
  res.status(200).json({list })
}) 

// В поиске реализован следующий принцип:выпадающий список модель(name) и артикул (model) ищутся в зависимости от бренда(brandId) и категории(categoryId)
// Список категории ищется только в зависимости от выбранного бренда, список бренда ни от чего не зависит и вываливается всегда весь