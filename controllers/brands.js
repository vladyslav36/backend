const Brand = require("../models/brandModel")
const { getSlug } = require("../utils/getSlug")
const {
  moveToDir,
  removeImage,  
  clearTempDir,
} = require("../utils/handleImages")

exports.getAllBrands = async (req, res) => {
  try {
    const brands = await Brand.find()
    res.status(200).json({ brands })
  } catch (error) {
    res.status(500).json({ msg: error.message })
  }
}

exports.addBrand = async (req, res) => {
  try {
  const { name, colors, sizes, heights, image } = req.body
  const slug = getSlug(name)
  const folder = "brand"
  const newImage = await moveToDir(slug, image, folder)
await clearTempDir()
  const brand = new Brand({
    name,
    slug,
    colors: colors.sort(),
    sizes: sizes.sort(),
    heights: heights.sort(),
    image: newImage,
  })

    const data = await brand.save()
    res.status(200).json(data)
  } catch (error) {
    res.status(500).json({ msg: error.message })
  }
}

exports.updateBrand = async (req, res) => {
  try {
  const { name, colors, sizes, heights, image, _id } = req.body
  const folder = "brand"
  const slug = getSlug(name)
  const newImage = await moveToDir(slug, image, folder)
await clearTempDir()
    const brand = await Brand.findOne({ _id })
    await removeImage(brand.image)
    const data = await Brand.updateOne(
      { _id },
      {
        name,
        colors,
        sizes,
        heights,
        image: newImage,
        slug,
      }
    )

    res.status(200).json({ msg: "Success" })
  } catch (error) {
    res.status(500).json({ msg: error.message })
  }
}

exports.deleteBrand = async (req, res) => {
  try {
    const { id } = req.params
    const brand = await Brand.findOne({ _id: id })
    const image = brand.image
    await removeImage(image)
    await Brand.deleteOne({ _id: id })

    res.status(200).json({ message: "success" })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
