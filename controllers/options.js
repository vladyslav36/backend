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

exports.updateOptions = asyncHandler(async (req, res) => {})
exports.deleteOptions = asyncHandler(async (req, res) => {})
