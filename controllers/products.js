const Product=require('../models/productModel')

exports.getShowcaseProducts = async (req, res, next) => {
  try {
    const showcaseProducts = await Product.find({ isShowcase: true })
    res.json({showcaseProducts})
  } catch (error) {
    return res.status(500).json({ msg: "Server error" })
  }
  
}
exports.getAllProducts = async (req, res, next) => {
  const { category }=req.query
  const products = await Product.find({ category })
  
  res.status(200).json({products})
}
exports.addProducts = (req, res,next) => {
  res.send('addProducts')
}
exports.deleteProduct = (req, res,next) => {
  res.send('deleteProduct')
}

