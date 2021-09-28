const Category = require("../models/categoryModel")
const Product = require("../models/productModel")
const { getSlug } = require("../utils/getSlug")
const multer = require("multer")
const path = require("path")
const { removeImage, updateImageToSlug } = require("../utils/handleImages")

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

exports.getAllCategories = async (req, res, next) => {
  try {
    const idToString = (id) => {
      return id === null ? '' : id.toString()
    }

    const categories = await Category.find()
    const prodCatId = await Product.find({}, { categoryId: 1 })

    // Подсчет кол-ва товаров в каждой категории
    const qnt = categories.map((category) => {
      let count = 0      
      const qntProducts = (category) => {
        const children = categories.filter(item => idToString(item.parentCategoryId) ===idToString(category._id))
        if (children.length) {          
          children.forEach((child) => {
            qntProducts(child)
          })
        } else {
          const prodInCategory = prodCatId.filter(
            (item) =>idToString(item.categoryId) ===idToString(category._id)
            
          )
          
          count += prodInCategory.length
        }
      }
      qntProducts(category)
      return { [category._id]: count }
    })
    // 
    res.status(200).json({ categories, qnt:Object.assign({},...qnt)})
  } catch (error) {
    return res.status(500).json({ msg: "Server error" })
  }
}

exports.addCategory = [
  multer({ storage }).single("image"),
  async (req, res, next) => {
    try {
      const { name, parentCategory, parentCategoryId, description } =
        JSON.parse(req.body.values)

      // Формирование level
      const level =
        parentCategoryId === null
          ? 0
          : (await Category.findById({ _id: parentCategoryId })).level + 1

      const slug = req.body.slug || getSlug(name)

      const category = new Category({
        name,
        parentCategory,
        parentCategoryId,
        description,
        image: req.file ? `/${req.file.path.replace(/\\/g, "/")}` : "",
        level,
        slug,
      })

      await category.save()
      res.status(200).json({ message: "Категория успешно добавлена" })
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  },
]
exports.updateCategory = [
  multer({ storage }).single("image"),
  async (req, res) => {
    try {
      const { name, parentCategory, parentCategoryId, description, _id } =
        JSON.parse(req.body.values)
      const imageClientPath = req.body.imageClientPath
      const slug = req.body.slug || getSlug(name)

      const level =
        parentCategoryId === null
          ? 0
          : (await Category.findById({ _id: parentCategoryId })).level + 1

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
          level,
          slug,
        }
      )
      res.status(200).json({ message: "Категория успешно изменена" })
    } catch (error) {
      res.status(500).json({ message: error.message })
    }
  },
]
exports.deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params
    const category = await Category.findOne({ _id: id })
    await removeImage(category.image)
    await Category.deleteOne({ _id: id })
    res.status(200).json({ message: "success" })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
