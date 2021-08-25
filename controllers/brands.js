const Brand = require("../models/brandModel")
const { getSlug } = require("../utils/getSlug")
const multer = require("multer")
const path = require("path")

const {  
  removeImage, 
  updateImageToSlug  
} = require("../utils/handleImages")
const { nextTick } = require("process")

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, `upload/images/brand/`)
  },
  filename: function (req, file, cb) {
    const { name }=JSON.parse(req.body.values)
    req.body.slug = getSlug(name)
    cb(null, `${req.body.slug}${path.extname(file.originalname)}`)
  },
})

const sortOpt = (arr) => arr.sort((a, b) => (a.name > b.name ? 1 : -1))

exports.getAllBrands = async (req, res) => {
  try {
    const brands = await Brand.find()
    res.status(200).json({ brands })
  } catch (error) {
    res.status(500).json({ msg: error.message })
  }
}

exports.addBrand = [
  multer({ storage }).single("image"),
  async (req, res) => {
    try {      
      const {name,colors,sizes,heights} = JSON.parse(req.body.values)      
      const slug = req.body.slug || getSlug(name)
      const brand = new Brand({
        name,
        slug,
        colors: sortOpt(colors),
        sizes: sortOpt(sizes),
        heights: sortOpt(heights),
        image: req.file ? `/${req.file.path.replace(/\\/g, "/")}` : "",
      })

      const data = await brand.save()
      res.status(200).json(data)
    } catch (error) {
      res.status(500).json({ msg: error.message })
    }
  },
]


exports.updateBrand = [
  multer({ storage }).single("image"),
  async (req, res) => {
    try {
      const { name, colors, sizes, heights,_id } =JSON.parse(req.body.values) 
      const  imageClientPath  = req.body.imageClientPath      
      const slug = req.body.slug || getSlug(name)
      const brand = await Brand.findOne({ _id })
      let imagePath = ""
      if (req.file) {
        imagePath = `/${req.file.path.replace(/\\/g, "/")}`
        await removeImage(brand.image)
      } else {
        if (imageClientPath) {
          imagePath = await updateImageToSlug(slug, brand.image)
        } else {
          await removeImage(brand.image)
        }
      }

      const data = await Brand.updateOne(
        { _id },
        {
          name,
          colors: sortOpt(colors),
          sizes: sortOpt(sizes),
          heights: sortOpt(heights),
          image: imagePath,
          slug,
        }
      )

      res.status(200).json({ msg: "Success" })
    } catch (error) {
      res.status(500).json({ msg: error.message })
    }
  },
]

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
