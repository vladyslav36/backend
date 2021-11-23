const Options = require("../models/optionsModel")
const asyncHandler = require("express-async-handler")

exports.addOptions = asyncHandler(async (req, res) => {
    const { name, brandId, options } = req.body
    const isExist = await Options.exists({ name })
    if (isExist) {
        throw new Error('У этого бренда уже есть опции')
    }
  const data = await Options.create({
    name,
    brandId,
    options,
  })
    res.status(200).json({data})
})

exports.getOptions = asyncHandler(async (req, res) => {
  const data = await Options.find()
  res.status(200).json({ data })
})
exports.getOptionById = asyncHandler(async (req, res) => {
  const { id }=req.params
  const brand = await Options.findById(id)
  res.status(200).json({ brand })
})
exports.getOptionByBrandId = asyncHandler(async (req, res) => {
  const { id } = req.params
  const data = await Options.findOne({brandId:id})
  res.status(200).json({ data })
})
exports.updateOptions = asyncHandler(async (req, res) => {
  const { _id, options } = req.body
  
  const data = await Options.updateOne({ _id }, { options })
  res.status(200).json({data})
})

exports.deleteOptions = asyncHandler(async (req, res) => {
  const { id } = req.params
  await Options.deleteOne({_id:id})
  res.status(200).json({message:'ok'})
})
