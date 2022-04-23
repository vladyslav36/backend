const Category = require("../models/categoryModel")
const Product=require('../models/productModel')
const { getSlug } = require("../utils/getSlug")
const multer = require("multer")
const path = require("path")
const { removeImage, updateImageToSlug } = require("../utils/handleImages")
const asyncHandler=require('express-async-handler')
const { setQntProducts } = require("../utils/setQntProducts")
const { getBrand } = require("../utils/getBrand")

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, `upload/images/category/`)
  },
  filename: function (req, file, cb) {
    const { name } = JSON.parse(req.body.values)
    req.body.slug = getSlug(name)
    cb(null, `${req.body.slug}${path.extname(file.originalname)}`)
  },
})

exports.getAllCategories = asyncHandler(
  async (req, res, next) => {  
    const categories = await Category.find()
    res.status(200).json({ categories})  
}
)
exports.getCategoryById = asyncHandler(
  async (req, res) => { 
    const { id } = req.params    
    const category = await Category.findById(id)
    res.status(200).json({ category})  
}
)
exports.getCategoryBySlug = asyncHandler(
  async (req, res) => { 
    const { slug } = req.params    
    const category = await Category.findOne({slug})
    res.status(200).json({ category})  
}
)

exports.getBrands = asyncHandler(
  async (req, res) => {
    const categories=await Category.find({parentCategoryId:null})
    res.status(200).json({categories})
  }
)

exports.addCategory = [
  multer({ storage }).single("image"),
  asyncHandler(
    async (req, res, next) => {
    
      const { name, parentCategory, parentCategoryId, description,options } =
        JSON.parse(req.body.values)

      

      const slug = req.body.slug || getSlug(name)

      const category = new Category({
        name,
        parentCategory,
        parentCategoryId,
        description,
        image: req.file ? `/${req.file.path.replace(/\\/g, "/")}` : "",
        options,
        slug,
      })
      const categories = await Category.find()
      const brand = getBrand(category, categories)
      category.brandId=brand._id
      await category.save()
      setQntProducts()
      res.status(200).json({ message: "Категория успешно добавлена" })
    
  }
  )
  
]
exports.updateCategory = [
  multer({ storage }).single("image"),
  asyncHandler(
    async (req, res) => {    
      const { name, parentCategory, parentCategoryId, description, _id,options } =
        JSON.parse(req.body.values)
      const imageClientPath = req.body.imageClientPath
      const slug = req.body.slug || getSlug(name)

      

      const category = await Category.findOne({ _id })

      let imagePath = ""
      if (req.file) {
        imagePath = `/${req.file.path.replace(/\\/g, "/")}`
        await removeImage(category.image)
      } else {
        if (imageClientPath) {
          imagePath = await updateImageToSlug(slug, category.image)
        } else {
          await removeImage(category.image)
        }
      }
      await removeImage(category.image)
      const categories=await Category.find()
      const brandId = getBrand({ _id, parentCategoryId },categories)._id
      await Category.updateOne(
        { _id },
        {
          name,
          parentCategory,
          parentCategoryId,
          description,
          image: imagePath,
          options,
          slug,
          brandId
        }
      )
      
      setQntProducts()
      if (parentCategoryId === null) {
        // в этом случае редактируется категория-бренд и нужно изменить все опции у всех товаров
        // которые относятся к этому бренду
        const products = await Product.find({ brandId: _id })
         await Promise.all(
           products.map(async (product) => {
             const newOptions = { ...options }

             if (Object.keys(newOptions).length) {
               Object.keys(newOptions).forEach((option) => {
                 if (typeof product.options[option] === "object") {
                   newOptions[option].isChangePrice =
                     product.options[option].isChangePrice
                   Object.keys(newOptions[option].values).forEach((value) => {
                     if (
                       typeof product.options[option].values[value] === "object"
                     ) {
                       newOptions[option].values[value].price =
                         product.options[option].values[value].price
                       newOptions[option].values[value].checked =
                         product.options[option].values[value].checked
                     }
                   })
                 }
               })
             }
             await Product.updateOne(
               { _id: product._id },
               { options: newOptions }
             )
           })
         )
      }
      res.status(200).json({ message: "Категория успешно изменена" })    
  }
  )
  
]
exports.deleteCategory = asyncHandler(
  async (req, res, next) => {  
    const { id } = req.params
    const category = await Category.findOne({ _id: id })
    await removeImage(category.image)
    await Category.deleteOne({ _id: id })
    setQntProducts()
    res.status(200).json({ message: "success" }) 
}
) 

