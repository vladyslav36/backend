// const Options = require("../models/optionsModel")
// const asyncHandler = require("express-async-handler")
// const Product = require("../models/productModel")

// exports.addOptions = asyncHandler(async (req, res) => {
//   const { name, brandId, options } = req.body
//   const isExist = await Options.exists({ name })
//   if (isExist) {
//     throw new Error("У этого бренда уже есть опции")
//   }
//   const option = new Options({
//     name,
//     brandId,
//     options: {},
//   })
//   await option.save()
//   option.options = options
//   const data = await option.save()
//   // Двойное сохранение с целью возможности сохранения ключа с точкой
//   res.status(200).json({ data })
// })

// exports.getOptions = asyncHandler(async (req, res) => {
//   const data = await Options.find()
//   res.status(200).json({ data })
// })
// exports.getOptionById = asyncHandler(async (req, res) => {
//   const { id } = req.params
//   const brandOption = await Options.findById(id)
//   res.status(200).json({ brandOption })
// })
// exports.getOptionByBrandId = asyncHandler(async (req, res) => {
//   const { id } = req.params
//   const data = await Options.findOne({ brandId: id })
//   res.status(200).json({ data })
// })
// exports.updateOptions = asyncHandler(async (req, res) => {
//   const { _id, options } = req.body
//   const brandOption = await Options.findById(_id)
//   // Обновление всех опций всех товаров у которых соответствует brandId

//   const products = await Product.find({ brandId: brandOption.brandId })
//   await Promise.all(
//     products.map(async (product) => {
//       const newOptions = { ...options }

//       if (Object.keys(newOptions).length) {
//         Object.keys(newOptions).forEach((option) => {
//           if (typeof product.options[option] === "object") {
//             newOptions[option].isChangePrice =
//               product.options[option].isChangePrice
//             Object.keys(newOptions[option].values).forEach((value) => {
//               if (typeof product.options[option].values[value] === "object") {
//                 newOptions[option].values[value].price =
//                   product.options[option].values[value].price
//                 newOptions[option].values[value].checked =
//                   product.options[option].values[value].checked
//               }
//             })
//           }
//         })
//       }
//       await Product.updateOne({ _id: product._id }, { options: newOptions })
//     })
//   )

//   const data = await Options.updateOne({ _id }, { options })

//   res.status(200).json({ data })
// })

// exports.deleteOptions = asyncHandler(async (req, res) => {
//   const { id } = req.params
//   await Options.deleteOne({ _id: id })
//   res.status(200).json({ message: "ok" })
// })
