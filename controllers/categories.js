const Category = require("../models/categoryModel")
const Product = require("../models/productModel")
const { getSlug } = require("../utils/getSlug")
const path = require("path")
const { removeImage } = require("../utils/handleImages")
const asyncHandler = require("express-async-handler")
const { setQntProducts } = require("../utils/setQntProducts")
const { getBrand } = require("../utils/getBrand")

exports.getAllCategories = asyncHandler(async (req, res) => {
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
  const categories = await Category.find({ parentId: null })
  res.status(200).json({ categories })
})

exports.addCategory = asyncHandler(async (req, res) => {
  const { name, parent, parentId, description, options } = JSON.parse(
    req.body.values
  )
  const root = process.env.ROOT_NAME
  let image,price,catalog
  if (req.files === null) {
    image = ""
    price = ''
    catalog=''
  } else {
    if ('image' in req.files) {
       const file = req.files.image
    const fileName = path.parse(file.name).name
    const fileExt = path.parse(file.name).ext
    image = `/upload/images/category/${getSlug(fileName)}${fileExt}`
    file.mv(`${root}${image}`)
    }
    if ('price' in req.files) {
       const file = req.files.price
    const fileName = path.parse(file.name).name
    const fileExt = path.parse(file.name).ext
    price = `/upload/prices/${getSlug(fileName)}${fileExt}`
    file.mv(`${root}${price}`)
    }
    if ('catalog' in req.files) {
       const file = req.files.catalog
    const fileName = path.parse(file.name).name
    const fileExt = path.parse(file.name).ext
    catalog = `/upload/catalogs/${getSlug(fileName)}${fileExt}`
    file.mv(`${root}${catalog}`)
    }
   
  }

  const slug = getSlug(name)

  const category = new Category({
    name,
    parent,
    parentId,
    description,
    image,
    price,
    catalog,
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
  const { name, parent, parentId, description, _id, options } = JSON.parse(
    req.body.values
  )
  const imageClientPath = req.body.imageClientPath
  const priceClientPath = req.body.priceClientPath
  const catalogClientPath = req.body.catalogClientPath
  const root = process.env.ROOT_NAME

  const category = await Category.findOne({ _id })

  const slug = getSlug(name)

  let image, price, catalog
  // Здесь прайс и каталог загружаемые для скачивания прайс и каталог товаров
  if (req.files===null) {
    if (imageClientPath) {
      // image = `/upload/images/category/${path.basename(imageClientPath)}`
      image=category.image
    } else {
      image = ""
      await removeImage(category.image)
    }
    if (priceClientPath) {      
      price=category.price
    } else {
      price = ""
      await removeImage(category.price)
    }
    if (catalogClientPath) {      
      catalog=category.catalog
    } else {
      catalog = ""
      await removeImage(category.catalog)
    }
  } else {
    if ('image' in req.files) {
       const file = req.files.image
    const fileName = path.parse(file.name).name
    const fileExt = path.parse(file.name).ext
    image = `/upload/images/category/${getSlug(fileName)}${fileExt}`
    file.mv(`${root}${image}`)
    await removeImage(category.image)
    }
    if ('price' in req.files) {
      const file = req.files.price
      const fileName = path.parse(file.name).name
      const fileExt = path.parse(file.name).ext
      price = `/upload/prices/${getSlug(fileName)}${fileExt}`
      file.mv(`${root}${price}`)
      await removeImage(category.price)
    }
    if ('catalog' in req.files) {
       const file = req.files.catalog
       const fileName = path.parse(file.name).name
       const fileExt = path.parse(file.name).ext
       catalog = `/upload/catalogs/${getSlug(fileName)}${fileExt}`
       file.mv(`${root}${catalog}`)
       await removeImage(category.catalog)
    }
  }

  const categories = await Category.find()
  const brandId = getBrand({ _id, parentId }, categories)._id
  const categoryUp = await Category.findOneAndUpdate(
    { _id },
    {
      name,
      parent,
      parentId,
      description,
      image,
      price,
      catalog,
      options,
      slug,
      brandId,
    },
    { new: true }
  )

  setQntProducts()
  if (parentId === null) {
    // в этом случае редактируется категория-бренд и нужно изменить все опции у всех товаров
    // которые относятся к этому бренду
    const optionsArr=Object.keys(options)
    const products = await Product.find({ brandId: _id })
    await Promise.all(
      products.map(async (product) => {
        // сначала убираем из товара те опции которых не стало в бренде
       const newOptions= Object.keys(product.options).reduce((acc, option) => {
          if (optionsArr.includes(option)) {
            acc[option]=product.options[option]
          }
          return acc
       }, {})
        // потом добавляем в товар ключ опции в формате [опцич]:{} которые появились в бренде
        for (const option of optionsArr) {
          if (!newOptions.hasOwnProperty(option)) {
            newOptions[option] = {}
          }
        }
       
        await Product.updateOne({ _id: product._id }, { options: newOptions })
      })
    )
  }
  res.status(200).json({ category: categoryUp })

  
})

exports.deleteCategory = asyncHandler(async (req, res, next) => {
  const { id } = req.params
  const category = await Category.findOne({ _id: id })
  await removeImage(category.image)
  if (category.parentId === null) {
    await removeImage(category.price)
    await removeImage(category.catalog)
  }
  await Category.deleteOne({ _id: id })
  setQntProducts()
  res.status(200).json({ message: "success" })
})
