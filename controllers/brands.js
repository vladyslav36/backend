const Brand = require("../models/brandModel")
const { getSlug } = require("../utils/getSlug")
const { moveToDir } = require("../utils/handleImages")

exports.getAllBrands = async (req, res) => {
  try {
    const brands = await Brand.find()
    res.status(200).json({ brands })
  } catch (error) {
    res.status(500).json({ msg: error.message })
  }
}

exports.addBrand = async (req, res) => {
  const { name, colors, sizes, heights, uploadedImage, image } = req.body
  const slug = getSlug(name)
  const folder = "brand"
  const newImage = uploadedImage
    ? moveToDir(uploadedImage, slug, image, folder)
    : ""

  const brand = new Brand({
    name,
    colors,
    sizes,
    heights,
    image: newImage,
  })

  try {
    const data = await brand.save()
    res.status(200).json(data)
  } catch (error) {
    res.status(500).json({msg:error.message})
  }
  
}

exports.updateBrand = async (req, res) => {}

exports.deleteBrand = async (req, res) => {}
