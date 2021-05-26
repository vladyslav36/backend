const Category = require("../models/categoryModel")
const slugify = require("slugify")
const path = require("path")
const { moveToDir } = require("../utils/moveToDir")

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
  // /upload/images / { имя категории } / { имя файла } и
  // сохранение нового пути
  const newImage = req.body.uploadedImage
    ? moveToDir(req.body.uploadedImage, req.body.name)
    : ""
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
    image: newImage,
    level,
    title: name,
  })

  const createdCategory = await category.save()
  res.json(createdCategory)
}
exports.updateCategory = (req, res, next) => {
  res.send("updateCategory")
}
exports.deleteCategory = (req, res, next) => {
  res.send("deleteCategory")
}
