const Category = require("../models/categoryModel")
const { getSlug } = require("../utils/getSlug")
const multer = require("multer")
const path = require("path")
const { removeImage, updateImageToSlug } = require("../utils/handleImages")
const asyncHandler=require('express-async-handler')
const { setQntProducts } = require("../utils/setQntProducts")

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

exports.getBrands = asyncHandler(
  async (req, res) => {
    const categories = await Category.find({ parentCategoryId: null })
    res.status(200).json({categories})
  }
)

exports.addCategory = [
  multer({ storage }).single("image"),
  asyncHandler(
    async (req, res, next) => {
    
      const { name, parentCategory, parentCategoryId, description } =
        JSON.parse(req.body.values)

      // Формирование level
      // const level =
      //   parentCategoryId === null
      //     ? 0
      //     : (await Category.findById({ _id: parentCategoryId })).level + 1

      const slug = req.body.slug || getSlug(name)

      const category = new Category({
        name,
        parentCategory,
        parentCategoryId,
        description,
        image: req.file ? `/${req.file.path.replace(/\\/g, "/")}` : "",
        // level,
        slug,
      })

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
      const { name, parentCategory, parentCategoryId, description, _id } =
        JSON.parse(req.body.values)
      const imageClientPath = req.body.imageClientPath
      const slug = req.body.slug || getSlug(name)

      // const level =
      //   parentCategoryId === null
      //     ? 0
      //     : (await Category.findById({ _id: parentCategoryId })).level + 1

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
      await Category.updateOne(
        { _id },
        {
          name,
          parentCategory,
          parentCategoryId,
          description,
          image: imagePath,
          // level,
          slug,
        }
      )
      setQntProducts()
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
