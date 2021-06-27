const { findOne } = require("../models/productModel")
const Product = require("../models/productModel")
const Category = require('../models/categoryModel')
const Brand=require('../models/brandModel')
const { getSlug } = require("../utils/getSlug")
const {
  moveToDir,
  removeImage,
  clearTempDir,
} = require("../utils/handleImages")

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
exports.getProductsNames = async (req,res,next) => {
  try {
    const products = await Product.find({}, { name: 1 })
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
exports.getSearchProducts = async ({query:{product,brand,category}}, res, next) => {
  try {
    
    const products = await Product.find({
      name: { $regex: `${product}` },
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
  try {
    const product = await Product.findOne({ slug })
    res.status(200).json({ product })
  } catch (error) {
    return res.status(500).json({ msg: "Server error" })
  }
}
exports.addProducts = async (req, res, next) => {
  try {
    const {
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

    const product = new Product({
      name,
      model,
      brand,
      brandId,
      slug,
      image: newImage,
      category,
      categoryId,
      colors: colors.sort(),
      sizes: sizes.sort(),
      heights: heights.sort(),
      description,
      addedImages: [...newAddedImages],
      isShowcase: isShowcase === "ДА" ? true : false,
      isInStock: isInStock === "ДА" ? true : false,

      price,
      retailPrice,
      currencyValue,
      countInStock,
    })
    const data = await product.save()

    res.status(200).json(data)
  } catch (error) {
    console.error(error)
    return res.status(500).json({ msg: "Server error" })
  }
}

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
        colors: colors.sort(),
        sizes: sizes.sort(),
        heights: heights.sort(),
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
