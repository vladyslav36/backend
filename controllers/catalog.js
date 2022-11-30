const Catalog = require('../models/catalogModel.js')
const asyncHandler = require("express-async-handler")
const { getSlug } = require('../utils/getSlug.js')
const path=require('path')
const { setQntCatalogProducts } = require('../utils/setQntCatalogProducts.js')
const { setQntProducts } = require('../utils/setQntProducts.js')
const { removeImage } = require('../utils/handleImages.js')

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
  const { name, parentId,parent } = JSON.parse(req.body.values)
  const root=process.env.ROOT_NAME
  let image
  if (req.files === null) {
    image = ""
  } else {
    const file = req.files.image
    const fileName = path.parse(file.name).name
    const fileExt = path.parse(file.name).ext
    image = `/upload/images/catalog/${getSlug(fileName)}${fileExt}`
    file.mv(`${root}${image}`)
  }
  const catalog = await Catalog.create({ name, parentId,image,parent })
  setQntCatalogProducts()
  res.status(200).json({catalog})
})

exports.updateCatalog = asyncHandler(async (req, res) => {
  
  const { name, parentId, parent, _id } = JSON.parse(req.body.values)
  const { imageClientPath } = req.body
  const root = process.env.ROOT_NAME
  const catalog = await Catalog.findOne({ _id })
  let image
  if (req.files === null) {
    if (imageClientPath) {
      image = `/upload/images/catalog/${path.basename(imageClientPath)}`
    } else {
      image = ""
      await removeImage(catalog.image)
    }
  } else {
    const file = req.files.image
    const fileName = path.parse(file.name).name
    const fileExt = path.parse(file.name).ext
    image = `/upload/images/catalog/${getSlug(fileName)}${fileExt}`
    file.mv(`${root}${image}`)
    await removeImage(catalog.image)
  }

  const catalogUp = await Catalog.findOneAndUpdate({ _id}, { name, parentId,parent,image }, { new: true })
  setQntCatalogProducts()
  res.status(200).json({catalog:catalogUp})
})

exports.deleteCatalog = asyncHandler(async (req, res) => {
  const { id } = req.params  
  await Catalog.deleteOne({_id:id})
  res.status(200).json({message:'Каталог успешно удален'})
})