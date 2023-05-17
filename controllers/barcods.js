const Barcode = require("../models/barcodeModel")
const Product=require('../models/productModel')
const asyncHandler = require("express-async-handler")
const { idToString } = require("../utils/idToString")

exports.getPrice = asyncHandler(async (req, res) => {
  const barcode = req.params.bc
  const doc = await Barcode.findOne({ barcode })

  res.status(200).json({ price: doc ? doc.price : "" })
})

exports.getBarcods = asyncHandler(async (req, res) => {
  const barcods = await Barcode.find({})
  res.status(200).json({ bcPrice: barcods })
})

exports.savePrice = asyncHandler(async (req, res) => {
  const barcode = req.params.bc
  const { price, productId = null, crumbsArr } = req.body
  console.log(productId, crumbsArr)
  const doc = await Barcode.findOne({ barcode })
  if (doc) {
    const isEqual = JSON.stringify(crumbsArr) === JSON.stringify(doc.crumbsArr)
    if (idToString(productId) !== idToString(doc.productId) || !isEqual) {
      res.status(500)
      throw new Error("Такой код уже существует")
    } else {
      doc.price = price
      await doc.save()
    }
  } else {
    await Barcode.create({ barcode, price, productId, crumbsArr })
  }

  res.status(200).json({ message: "ok" })
})

exports.deletePrice = asyncHandler(async (req, res) => {
  const barcode = req.params.bc
  await Barcode.deleteOne({ barcode })
  res.status(200).json({ message: "ok" })
})

exports.getProduct = asyncHandler(async (req, res) => {
  const barcode = req.params.bc
  const doc = await Barcode.findOne({ barcode })
  const product=doc?await Product.findById(doc.productId).populate('brandId categoryId'):null
  res.status(200).json({barcode:doc,product})
})
