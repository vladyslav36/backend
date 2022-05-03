const Category = require("../models/categoryModel")
const Product = require("../models/productModel")
const { getSlug } = require("../utils/getSlug")
const path = require("path")
const { removeImage } = require("../utils/handleImages")
const asyncHandler = require("express-async-handler")
const { setQntProducts } = require("../utils/setQntProducts")
const { getBrand } = require("../utils/getBrand")

exports.getAllCategories = asyncHandler(async (req, res, next) => {
  const categories = await Category.find()
  res.status(200).json({ categories })
})
exports.getCategoryById = asyncHandler(async (req, res) => {
  const { id } = req.params
  const category = await Category.findById(id)
  res.status(200).json({ category })
})
exports.getCategoryBySlug = asyncHandler(async (req, res) => {
  const { slug } = req.params
  const category = await Category.findOne({ slug })
  res.status(200).json({ category })
})

exports.getBrands = asyncHandler(async (req, res) => {
  const categories = await Category.find({ parentCategoryId: null })
  res.status(200).json({ categories })
})

exports.addCategory = asyncHandler(async (req, res) => {
  const { name, parentCategory, parentCategoryId, description, options } =
    JSON.parse(req.body.values)
  const root = process.env.ROOT_NAME
  let image
  if (req.files === null) {
    image = ""
  } else {
    const file = req.files.image
    const fileName = path.parse(file.name).name
    const fileExt = path.parse(file.name).ext
    image = `/upload/images/category/${getSlug(fileName)}${fileExt}`
    file.mv(`${root}${image}`)
  }

  const slug = getSlug(name)

  const category = new Category({
    name,
    parentCategory,
    parentCategoryId,
    description,
    image,
    options,
    slug,
  })
  const categories = await Category.find()
  const brand = getBrand(category, categories)
  category.brandId = brand._id
  await category.save()
  setQntProducts()
  res.status(200).json({ message: "Категория успешно добавлена" })
})

exports.updateCategory = asyncHandler(async (req, res) => {
  const { name, parentCategory, parentCategoryId, description, _id, options } =
    JSON.parse(req.body.values)
  const imageClientPath = req.body.imageClientPath
  const root = process.env.ROOT_NAME

  const category = await Category.findOne({ _id })

  const slug = getSlug(name)

  let image
  if (req.files === null) {
    if (imageClientPath) {
      image = `/upload/images/category/${path.basename(imageClientPath)}`
    } else {
      image = ""
      await removeImage(category.image)
    }
  } else {
    const file = req.files.image
    const fileName = path.parse(file.name).name
    const fileExt = path.parse(file.name).ext
    image = `/upload/images/category/${getSlug(fileName)}${fileExt}`
    file.mv(`${root}${image}`)
    await removeImage(category.image)
  }

  const categories = await Category.find()
  const brandId = getBrand({ _id, parentCategoryId }, categories)._id
  const categoryUp=await Category.findOneAndUpdate(
    { _id },
    {
      name,
      parentCategory,
      parentCategoryId,
      description,
      image,
      options,
      slug,
      brandId,
    },{new:true}
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
                if (typeof product.options[option].values[value] === "object") {
                  newOptions[option].values[value].price =
                    product.options[option].values[value].price
                  newOptions[option].values[value].checked =
                    product.options[option].values[value].checked
                }
              })
            }
          })
        }
        await Product.updateOne({ _id: product._id }, { options: newOptions })
      })
    )
  }
  res.status(200).json({ category:categoryUp })
})

exports.deleteCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params
  const category = await Category.findOne({ _id: id })
  await removeImage(category.image)
  await Category.deleteOne({ _id: id })
  setQntProducts()
  res.status(200).json({ message: "success" })
})
