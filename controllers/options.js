const Options = require("../models/optionsModel")
const asyncHandler = require("express-async-handler")
const Product = require("../models/productModel")

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
  // Обновление всех опций всех товаров у которых соответствует brandId
  const option = await Options.findById(_id)
  const optionsBrandNames=options.map(opt=>opt.name)
  const products = await Product.find({ brandId: option.brandId })
  // для этого сначала из product.options удаляем все опции которых нет в бренде,
  // затем берем из бренда новые опции и на их основе вставляем в product.options
  // объекты новых опций. И так перебираем все товары с brandId
  Promise.all(
    products.map(async (item) => {
    let newOptions = item.options.filter(opt => optionsBrandNames.includes(opt.name))
    const newOptionsNames = newOptions.map(opt => opt.name)
    const nameToAdd = optionsBrandNames.filter(name => !newOptionsNames.includes(name))
    newOptions = [...newOptions, ...nameToAdd.map(name => ({
      isChangePrice: false,
      name: name,
      values:[]
    }))]
    await Product.updateOne({ _id: item._id },{options:newOptions})    
    })
  ) 
  
  const data = await Options.updateOne({ _id }, { options })
  res.status(200).json({data})
})

exports.deleteOptions = asyncHandler(async (req, res) => {
  const { id } = req.params
  await Options.deleteOne({_id:id})
  res.status(200).json({message:'ok'})
})
