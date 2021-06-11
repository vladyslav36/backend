const Category = require("../models/categoryModel")
const mongoose = require("mongoose")
const { getSlug } = require("../utils/getSlug")

const path = require("path")
const {
  updateImageToSlug,
  moveToDir,
  removeImage,
} = require("../utils/handleImages")
const { findOne } = require("../models/categoryModel")
const Product = require("../models/productModel")

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

  const { name, parentCategory, parentCategoryId, description, image } =
    req.body
  // Формирование level
  const level =
    parentCategoryId === null
      ? 0
      : (await Category.findById({ _id: parentCategoryId })).level + 1

  const slug = getSlug(name)
  const folder = "category"
  const newImage = req.body.uploadedImage
    ? moveToDir(req.body.uploadedImage, slug, image, folder)
    : ""

  const category = new Category({
    name,
    parentCategory,
    parentCategoryId,
    description,
    image: newImage,
    level,
    slug,
  })

  try {
    const data = await category.save()
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

  const slug = getSlug(name)

  // const category = await Category.findOne({ _id })
  const folder = "category"
  const newImage = uploadedImage
    ? moveToDir(uploadedImage, slug, image, folder)
    : updateImageToSlug(slug, image)

  try {
    await Category.updateOne(
      { _id },
      {
        name,
        parentCategory,
        parentCategoryId,
        description,
        image: newImage,
        level,
        slug,
      }
    )
    res.status(200).json({ message: "Категория успешно изменена" })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

exports.deleteCategory = async (req, res, next) => {
  const { id } = req.params
  const category = await Category.findOne({ _id: id })
  const image = category.image
  removeImage(image)
  try {
    await Category.deleteOne({ _id: id })

    res.status(200).json({ message: "success" })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
