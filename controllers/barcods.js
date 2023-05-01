const Barcode = require('../models/barcodeModel')
const asyncHandler=require('express-async-handler')

exports.getPrice = asyncHandler(async (req, res) => { 
  const barcode = req.params.bc
  const doc = await Barcode.findOne({ barcode })

  res.status(200).json({price:doc?doc.price:''})
}) 
  

exports.savePrice = asyncHandler(
  async (req, res) => {
    const barcode = req.params.bc
    const { price } = req.body
    const doc = await Barcode.findOne({ barcode })
    if (doc) {
      doc.price=price
      await doc.save()
    } else {
      await Barcode.create({barcode,price})
    }
  
    res.status(200).json({message:'ok'})
}
)

exports.deletePrice = asyncHandler(async (req, res) => {
  const barcode = req.params.bc
  await Barcode.deleteOne({ barcode })
  res.status(200).json({message:'ok'})
})