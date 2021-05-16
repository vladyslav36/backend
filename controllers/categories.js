const Category=require('../models/categoryModel')

exports.getAllCategories = async (req, res, next) => {
  try {
    const categories = await Category.find()
    res.status(200).json({ categories })
  } catch (error) {
    return res.status(500).json({msg:'Server error'})
  }
  
}
exports.addCategory = (req, res, next) => {
  res.send('addCategory')
}
exports.updateCategory = (req, res, next) => {
  res.send('updateCategory')
}
exports.deleteCategory = (req, res, next) => {
  res.send('deleteCategory')
}