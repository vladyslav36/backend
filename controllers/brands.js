const Brand = require("../models/brandModel")
const { getSlug } = require("../utils/getSlug")
const multer = require("multer")
const path = require("path")
const asyncHandler = require('express-async-handler')


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

exports.getAllBrands = asyncHandler(async (req, res) => { 
    const brands = await Brand.find()
    res.status(200).json({ brands }) 
})

exports.addBrand = [
  multer({ storage }).single("image"),
  asyncHandler(
     async (req, res) => {         
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
  }
  )
 
]


exports.updateBrand = [
  multer({ storage }).single("image"),
  asyncHandler(
    async (req, res) => {
    
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

      res.status(200).json({ message: "Success" })
    
  }
  )
  
]

exports.deleteBrand =asyncHandler( async (req, res) => {  
    const { id } = req.params
    const brand = await Brand.findOne({ _id: id })
    const image = brand.image
    await removeImage(image)
    await Brand.deleteOne({ _id: id })
    res.status(200).json({ message: "success" }) 
})
