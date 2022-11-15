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