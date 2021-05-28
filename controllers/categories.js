const Category = require("../models/categoryModel")

const path = require("path")
const { moveToDir,moveToCategoryDir } = require("../utils/moveToDir")

exports.getAllCategories = async (req, res, next) => {
  try {
    const categories = await Category.find()
    res.status(200).json({ categories })
  } catch (error) {
    return res.status(500).json({ msg: "Server error" })
  }
}
// exports.addCategory = async (req, res, next) => {
//   // Создание дирректории, сохранение файла в виде
//   // /upload/images / { имя категории } / { имя файла } и
//   // сохранение нового пути
//   const newImage = req.body.uploadedImage
//     ? moveToDir(req.body.uploadedImage, req.body.name)
//     : ""
//   const { name, parentCategory, parentCategoryId, description } = req.body
//   // Формирование level
//   const level =
//     parentCategoryId === null
//       ? 0
//       : (await Category.findById({ _id: parentCategoryId })).level + 1
  
//   const category = new Category({
//     name,
//     parentCategory,
//     parentCategoryId,
//     description,
//     image: newImage,
//     level,
//     title: name,
//   })

//   const createdCategory = await category.save()
  
//   res.json(createdCategory)
// }
exports.addCategory = async (req, res, next) => {
  // Создание дирректории, сохранение файла в виде
  // /upload/images / { имя категории } / { имя файла } и
  // сохранение нового пути
  // const newImage = req.body.uploadedImage
  //   ? moveToDir(req.body.uploadedImage, req.body.name)
  //   : ""

  const { name, parentCategory, parentCategoryId, description } = req.body
  // Формирование level
  const level =
    parentCategoryId === null
      ? 0
      : (await Category.findById({ _id: parentCategoryId })).level + 1
  
  const category = new Category({
    name,
    parentCategory,
    parentCategoryId,
    description,
    image: '',
    level,
    title: name,
  })

  const data=await category.save()
  const slug = data.slug
  const newImage = req.body.uploadedImage ? moveToCategoryDir(req.body.uploadedImage, slug) : ''
  
  try {
    await category.update({ image: newImage })
    res.status(200).json({message:'Категория успешно добавлена'})
  } catch (error) {
    res.status(400).json({message:error.message})
  }
   
  
  res.json(createdCategory)
}
exports.updateCategory = (req, res, next) => {
  res.send("updateCategory")
}
exports.deleteCategory = (req, res, next) => {
  res.send("deleteCategory")
}
