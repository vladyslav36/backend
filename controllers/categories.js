const Category = require("../models/categoryModel")
const { getSlug } = require("../utils/getSlug")
const { moveToDir, removeImage } = require("../utils/handleImages")

exports.getAllCategories = async (req, res, next) => {
  try {
    const categories = await Category.find()
    res.status(200).json({ categories })
  } catch (error) {
    return res.status(500).json({ msg: "Server error" })
  }
}

exports.addCategory = async (req, res, next) => {
  try {
    const { name, parentCategory, parentCategoryId, description, image } =
      req.body
    // Формирование level
    const level =
      parentCategoryId === null
        ? 0
        : (await Category.findById({ _id: parentCategoryId })).level + 1

    const slug = getSlug(name)
    const folder = "category"
    const newImage = await moveToDir(slug, image, folder)
    await clearTempDir()
    const category = new Category({
      name,
      parentCategory,
      parentCategoryId,
      description,
      image: newImage,
      level,
      slug,
    })

    await category.save()
    res.status(200).json({ message: "Категория успешно добавлена" })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}

exports.updateCategory = async (req, res) => {
  try {
    const { name, parentCategory, parentCategoryId, description, _id, image } =
      req.body

    const level =
      parentCategoryId === null
        ? 0
        : (await Category.findById({ _id: parentCategoryId })).level + 1

    const slug = getSlug(name)
    const folder = "category"
    const newImage = await moveToDir(slug, image, folder)
    await clearTempDir()
    const category = await Category.findOne({ _id })
    await removeImage(category.image)
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
  try {
  const { id } = req.params
  const category = await Category.findOne({ _id: id })
  await removeImage(category.image)
    await Category.deleteOne({ _id: id })
    res.status(200).json({ message: "success" })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
