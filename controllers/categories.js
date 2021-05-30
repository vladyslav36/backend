const Category = require("../models/categoryModel")
const mongoose = require("mongoose")

const path = require("path")
const { moveToDir, moveToCategoryDir } = require("../utils/moveToDir")
const { findOne } = require("../models/categoryModel")

exports.getAllCategories = async (req, res, next) => {
  try {
    const categories = await Category.find()
    res.status(200).json({ categories })
  } catch (error) {
    return res.status(500).json({ msg: "Server error" })
  }
}

exports.addCategory = async (req, res, next) => {
  // Создание дирректории, сохранение файла в виде
  // /upload/images /category / { slug файла } и
  // сохранение нового пути

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
    image: "",
    level    
  })
  // Первоначальное сохранение категории в базе
  const data = await category.save()
  const slug = data.slug
  // Взятие slug и переименование файла картинки
  const newImage = req.body.uploadedImage
    ? moveToCategoryDir(req.body.uploadedImage, slug)
    : ""
  //  обновление поля image  в базе
  try {
    await category.updateOne({ image: newImage })
    res.status(200).json({ message: "Категория успешно добавлена" })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

exports.updateCategory = async (req, res) => {
  const {
    name,
    parentCategory,
    parentCategoryId,
    description,    
    _id,
    image,
    uploadedImage,
  } = req.body

  const level =
    parentCategoryId === null
      ? 0
      : (await Category.findById({ _id: parentCategoryId })).level + 1

  await Category.updateOne(
    { _id },
    { name, parentCategory, parentCategoryId, description, image,level }
  )
  const category = await Category.findOne({ _id })

  const slug = category.slug
  const newImage = uploadedImage
    ? moveToCategoryDir(uploadedImage, slug, image)
    : image

  try {
    await category.updateOne({ image: newImage })
    res.status(200).json({ message: "Категория успешно изменена" })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

exports.deleteCategory = async (req, res, next) => {
  const { id }=req.params
   await Category.deleteOne({ _id: id })
  
  res.status(200).json({ message: "success" })
}
