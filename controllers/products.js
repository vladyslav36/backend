const Product = require("../models/productModel")
const { getSlug } = require("../utils/getSlug")
const { moveToDir } = require("../utils/handleImages")

exports.getShowcaseProducts = async (req, res, next) => {
  try {
    const showcaseProducts = await Product.find({ isShowcase: true })
    res.status(200).json({ showcaseProducts })
  } catch (error) {
    return res.status(500).json({ msg: "Server error" })
  }
}
exports.getAllProducts = async (req, res, next) => {
  const { categorySlug } = req.query
  try {
    const products = await Product.find({ categorySlug })

  res.status(200).json({ products })
  } catch (error) {
    return res.status(500).json({ msg: "Server error" })
  }
  
}
exports.addProducts = async (req, res, next) => {
  const {
    name,
    model,
    image,
    uploadedImage,
    uploadedImages,
    category,
    categorySlug,
    description,
    addedImages,
    isShowcase,
    price,
    retailPrice,
    currencyValue,
    countInStock,
  } = req.body

  const productSlug = getSlug(name)
  const folder = "product"
  const newImage = uploadedImage
    ? moveToDir(uploadedImage, productSlug, image, folder)
    : ""
  const newAddedImages = uploadedImages.length
    ? uploadedImages.map((item, i) =>
        moveToDir(item, getSlug(name), addedImages[i], folder)
      )
    : []
  const product = new Product({
    name,
    model,
    productSlug,
    image: newImage,
    category,
    categorySlug,
    description,
    addedImages: newAddedImages,
    isShowcase,
    price,
    retailPrice,
    currencyValue,
    countInStock,
  })
  try {
    const data = await product.save()
  res.status(200).json(data)
  } catch (error) {
    return res.status(500).json({ msg: "Server error" })
  }
  
}
exports.deleteProduct = (req, res, next) => {
  res.send("deleteProduct")
}
