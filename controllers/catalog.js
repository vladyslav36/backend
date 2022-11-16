const Catalog = require('../models/catalogModel.js')
const asyncHandler = require("express-async-handler")

exports.getAllCatalogs = asyncHandler(async(req, res) => {
  const catalogs =await Catalog.find()
  res.status(200).json({catalogs})
})

exports.getCatalogById = asyncHandler(async (req, res) => {
  const { id } = req.params
  const catalog=await Catalog.findById(id)
  res.status(200).json({catalog})
})

exports.addCatalog = asyncHandler(async (req, res) => {
  const { name, parentCatalogId } = req.body
  const catalog = await Catalog.create({ name, parentCatalogId })
  res.status(200).json({catalog})
})

exports.updateCatalog = asyncHandler(async (req, res) => {
  const { id } = req.params
  const { name, parentCatalogId } = req.body
  const catalog = await Catalog.findOneAndUpdate({ _id: id }, { name, parentCatalogId }, { new: true })
  res.status(200).json({catalog})
})

exports.deleteCatalog = asyncHandler(async (req, res) => {
  const { id } = req.params
  console.log(id)
  await Catalog.deleteOne({_id:id})
  res.status(200).json({message:'Каталог успешно удален'})
})