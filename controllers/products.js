const { findOne } = require("../models/productModel")
const Product = require("../models/productModel")
const Category = require('../models/categoryModel')
const Brand=require('../models/brandModel')
const { getSlug } = require("../utils/getSlug")
const multer = require('multer')
const path=require('path')
const {
  moveToDir,
  removeImage,
  clearTempDir,
  resizeImage
} = require("../utils/handleImages")

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, `upload/images/product/`)
  },
  filename: function (req, file, cb) {
    const { name } = JSON.parse(req.body.values)
     const slug = getSlug(name)
    
    cb(null, `${slug}${path.extname(file.originalname)}`)
  },
})
const sortOpt = (arr) => arr.sort((a, b) => (a.name > b.name ? 1 : -1))

exports.getShowcaseProducts = async (req, res, next) => {
  try {
    const showcaseProducts = await Product.find({ isShowcase: true })
    res.status(200).json({ showcaseProducts })
  } catch (error) {
    return res.status(500).json({ msg: "Server error" })
  }
}
exports.getAllProducts = async (req, res, next) => {  
  try {    
    const products = await Product.find()
    res.status(200).json({ products })
  } catch (error) {
    return res.status(500).json({ msg: "Server error" })
  }
}
exports.getProductsCategoryId = async (req, res, next) => {
  const categoryId = req.params.id  
  try {    
    const products = await Product.find({categoryId})
    res.status(200).json({ products })
  } catch (error) {
    return res.status(500).json({ msg: "Server error" })
  }
}

exports.getProductsNames = async (req,res,next) => {
  try {
    const products = await Product.find({}, { name: 1,model:1 })
    const categories = await Category.find({}, { name: 1 })
    const brands = await Brand.find({}, { name: 1 })
    res.status(200).json({
      products,
      categories,
      brands
    })
  } catch (error) {
    return res.status(500).json({ msg: "Server error" })
  }
}
exports.getSearchProducts = async ({query:{product='',brand='',category='',model=''}}, res, next) => {
  try {
  
    const products = await Product.find({
      name: { $regex: `${product}` },
      model:{$regex:`${model}`},
      brand: { $regex: `${brand}` },
      category: { $regex: `${category}` },
    }) 

    res.status(200).json({ products })
  } catch (error) {
    return res.status(500).json({ msg: "Server error" })
  }
}

exports.getProduct = async (req, res, next) => {
  const { slug } = req.params
  console.log(slug)
  try {
    const product = await Product.findOne({ slug })
    res.status(200).json({ product })
  } catch (error) {
    return res.status(500).json({ msg: "Server error" })
  }
}
exports.addProducts = [ multer({ storage }).array('images'), async (req, res, next) => {
  try {
    const {
      name,
      model,
      brand,
      brandId,      
      category,
      categoryId,
      colors,
      sizes,
      heights,
      isShowcase,
      isInStock,
      description,      
      price,
      retailPrice,
      currencyValue      
    } = JSON.parse(req.body.values)

    const slug = req.files.length?path.parse(req.files[0].filename).name:getSlug(name)
    const images = req.files.map((item) => `/${item.path.replace(/\\/g, "/")}`) || []
    const imagesMd = []
    const imagesSm = []
    images.forEach((item, i) => {
      const { md, sm } = resizeImage(item)
      imagesMd[i] = md
      imagesSm[i]=sm
    })
    
    
    const product = new Product({
      name,
      model,
      brand,
      brandId,
      slug,
      images,
      imagesMd,
      imagesSm,
      category,
      categoryId,
      colors: sortOpt(colors),
      sizes: sortOpt(sizes),
      heights: sortOpt(heights),
      description,
      isShowcase: isShowcase === "ДА" ? true : false,
      isInStock: isInStock === "ДА" ? true : false,
      price,
      retailPrice,
      currencyValue    
    })
    const data = await product.save()

    res.status(200).json(data)
  } catch (error) {
    console.error(error)
    return res.status(500).json({ msg: "Server error" })
  }
}
]
exports.updateProduct = async (req, res, next) => {
  try {
    const {
      _id,
      name,
      model,
      brand,
      brandId,
      image,
      category,
      categoryId,
      colors,
      sizes,
      heights,
      isShowcase,
      isInStock,
      description,
      addedImages,
      price,
      retailPrice,
      currencyValue,
      countInStock,
    } = req.body

    const slug = getSlug(name)
    const folder = "product"
    const newImage = await moveToDir(slug, image, folder)

    const newAddedImages = await Promise.all(
      addedImages.map(
        async (item) => await moveToDir(getSlug(name), item, folder)
      )
    )
    await clearTempDir()
    const product = await Product.findOne({ _id })
    await removeImage(product.image)
    product.addedImages.map(async (item) => await removeImage(item))
    await Product.updateOne(
      { _id },
      {
        name,
        model,
        brand,
        brandId,
        slug,
        image: newImage,
        category,
        categoryId,
        colors: colors.sort((a, b) => a.name - b.name),
        sizes: sizes.sort((a, b) => a.name - b.name),
        heights: heights.sort((a, b) => a.name - b.name),
        description,
        addedImages: [...newAddedImages],
        isShowcase: isShowcase === "ДА" ? true : false,
        isInStock: isInStock === "ДА" ? true : false,
        price,
        retailPrice,
        currencyValue,
        countInStock,
      }
    )

    res.status(200).json({ msg: "Товар успешно обновлен" })
  } catch (error) {
    return res.status(500).json({ msg: "Server error" })
  }
}
exports.deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params
    const product = await Product.findOne({ _id: id })
    await removeImage(product.image)
    await Promise.all(
      product.addedImages.map(async (item) => await removeImage(item))
    )
    await Product.deleteOne({ _id: id })

    res.status(200).json({ message: "success" })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
