const { findOne } = require("../models/productModel")
const Product = require("../models/productModel")
const Category = require("../models/categoryModel")
const Brand = require("../models/brandModel")
const { getSlug } = require("../utils/getSlug")
const multer = require("multer")
const fs=require('fs-extra')
const path = require("path")
const {
  moveToDir,
  removeImage,
  clearTempDir,
  resizeImage,
  updateImageToSlug,
  renameImages,
} = require("../utils/handleImages")


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, `upload/images/product/`)
  },
  filename: function (req, file, cb) {
    const { name } = JSON.parse(req.body.values)
    const slug = getSlug(name)

    cb(null, `${slug}${path.extname(file.originalname)}`)
  },
})
const sortOpt = (arr) => arr.sort((a, b) => (a.name > b.name ? 1 : -1))

exports.getShowcaseProducts = async (req, res, next) => {
  try {
    const showcaseProducts = await Product.find({ isShowcase: true })
    res.status(200).json({ showcaseProducts })
  } catch (error) {
    return res.status(500).json({ msg: "Server error" })
  }
}
exports.getAllProducts = async (req, res, next) => {
  try {
    const products = await Product.find()
    res.status(200).json({ products })
  } catch (error) {
    return res.status(500).json({ msg: "Server error" })
  }
}
exports.getProductsCategoryId = async (req, res, next) => {
  const categoryId = req.params.id
  try {
    const products = await Product.find({ categoryId })
    res.status(200).json({ products })
  } catch (error) {
    return res.status(500).json({ msg: "Server error" })
  }
}

exports.getProductsNames = async (req, res, next) => {
  try {
    const products = await Product.find({}, { name: 1, model: 1,imagesSm:1 })
    const categories = await Category.find({}, { name: 1 })
    const brands = await Brand.find({}, { name: 1 })
    res.status(200).json({
      products,
      categories,
      brands,
    })
  } catch (error) {
    return res.status(500).json({ msg: "Server error" })
  }
}
exports.getSearchProducts = async (
  { query: { product = "", brand = "", category = "", model = "" } },
  res,
  next
) => {
  try {
    const products = await Product.find({
      name: { $regex: `${product}` },
      model: { $regex: `${model}` },
      brand: { $regex: `${brand}` },
      category: { $regex: `${category}` },
    })

    res.status(200).json({ products })
  } catch (error) {
    return res.status(500).json({ msg: "Server error" })
  }
}

exports.getProduct = async (req, res, next) => {
  const { slug } = req.params
  console.log(slug)
  try {
    const product = await Product.findOne({ slug })
    res.status(200).json({ product })
  } catch (error) {
    return res.status(500).json({ msg: "Server error" })
  }
}
exports.addProducts = [
  multer({ storage }).array("images"),
  async (req, res, next) => {
    try {
      const {
        name,
        model,
        brand,
        brandId,
        category,
        categoryId,
        colors,
        sizes,
        heights,
        isShowcase,
        isInStock,
        description,
        price,
        retailPrice,
        currencyValue,
      } = JSON.parse(req.body.values)

      const slug = req.files.length
        ? path.parse(req.files[0].filename).name
        : getSlug(name)
      const images =
        req.files.map((item) => `/${item.path.replace(/\\/g, "/")}`) || []

      const imagesMd = []
      const imagesSm = []
      images.forEach((item) => {
        const { sm, md } = resizeImage(item)
        imagesMd.push(md)
        imagesSm.push(sm)
      })
     

      const product = new Product({
        name,
        model,
        brand,
        brandId,
        slug,
        images,
        imagesMd,
        imagesSm,
        category,
        categoryId,
        colors: sortOpt(colors),
        sizes: sortOpt(sizes),
        heights: sortOpt(heights),
        description,
        isShowcase: isShowcase === "ДА" ? true : false,
        isInStock: isInStock === "ДА" ? true : false,
        price,
        retailPrice,
        currencyValue,
      })
      const data = await product.save()

      res.status(200).json({ data })
    } catch (error) {
      console.error(error)
      return res.status(500).json({ msg: "Server error" })
    }
  },
]
exports.updateProduct = [
  multer({ storage }).array("images"),
  async (req, res, next) => {
    try {
      const {
        _id,
        name,
        model,
        brand,
        brandId,
        category,
        categoryId,
        colors,
        sizes,
        heights,
        isShowcase,
        isInStock,
        description,
        price,
        retailPrice,
        currencyValue,
      } = JSON.parse(req.body.values)
      const imageClientPaths = JSON.parse(req.body.imageClientPaths)

      const slug = req.files.length ? path.parse(req.files[0].filename).name : getSlug(name)
      
      let count = 0
      const images = (imageClientPaths.map((item, i) => {
        // условие разделяет ссылки на картинки старые и новые которые прилетают с фронта с "blob..."
        const isBlob = item.indexOf("blob") >= 0 ? true : false
        if (isBlob) {
          const newPath = `/${req.files[count].path.replace(/\\/g, "/")}`
          count++
          return newPath
        } else {
          // если ссылка на картинку осталась прежняя а название продукта изменилось, 
          // этот блок вставляет новый слаг в название картинок и переименовывает их
          const newSlug = `${slug.split('-')[0]}-${path.parse(item).name.split('-')[1]}`
          const newSlugMd = `${slug.split('-')[0]}-${path.parse(item).name.split('-')[1]}-md`
          const newSlugSm = `${slug.split('-')[0]}-${path.parse(item).name.split('-')[1]}-sm`
          const ext = path.extname(item)
          const ROOT_NAME=process.env.ROOT_NAME
          const dirName=`${ROOT_NAME}/upload/images/product`
          const oldPath = `${dirName}/${
            path.parse(item).name
          }${ext}`
          const oldPathMd = `${dirName}/${
            path.parse(item).name
          }-md${ext}`
          const oldPathSm = `${dirName}/${
            path.parse(item).name
          }-sm${ext}`          
          
          const newPath = `${dirName}/${newSlug}${ext}`
          const newPathMd = `${dirName}/${newSlugMd}${ext}`
          const newPathSm = `${dirName}/${newSlugSm}${ext}`          
          
          fs.rename(oldPath,newPath,(err)=>console.log(err))
          fs.rename(oldPathMd,newPathMd,(err)=>console.log(err))
          fs.rename(oldPathSm, newPathSm, (err) => console.log(err))
          
          return `/upload/images/product/${newSlug}${ext}`
        }
      }))
     
      const product = await Product.findOne({ _id })
      const dbPaths = product.images
    //  удаление картинок, которые есть в базе но которых уже нет на фронте, т.е. пользователь из удалил
      dbPaths.forEach(async item => {
        if (!images.includes(item)) {
          const parsedPath = path.parse(item)
         
          await removeImage(item)
          await removeImage(`${path.dirname(item)}/${parsedPath.name}-md${parsedPath.ext}`)
          await removeImage(
            `${path.dirname(item)}/${parsedPath.name}-sm${parsedPath.ext}`
          )
        }
      })    
     
       const imagesMd = []
       const imagesSm = []
       images.forEach((item) => {
         const { sm, md } = resizeImage(item)
         imagesMd.push(md)
         imagesSm.push(sm)
       })
       
      
      await Product.updateOne(
        { _id },
        {
          name,
          model,
          brand,
          brandId,
          slug,
          images,
          imagesMd,
          imagesSm,
          category,
          categoryId,
          colors: colors.sort((a, b) => a.name - b.name),
          sizes: sizes.sort((a, b) => a.name - b.name),
          heights: heights.sort((a, b) => a.name - b.name),
          description,
          isShowcase: isShowcase === "ДА" ? true : false,
          isInStock: isInStock === "ДА" ? true : false,
          price,
          retailPrice,
          currencyValue
        }
      )

      res.status(200).json({ msg: "Товар успешно обновлен" })
     
    } catch (error) {
      return res.status(500).json({ msg: "Server error" })
    }
  },
]
exports.deleteProduct = async (req, res, next) => {
  try {
    const { id } = req.params
    const product = await Product.findOne({ _id: id })
  
    await Promise.all(
      product.images.map(async (item) => await removeImage(item))
      // product.imagesMd.map(async (item) => await removeImage(item))
      // product.imagesSm.map(async (item) => await removeImage(item))
    )
    await Promise.all(      
      product.imagesMd.map(async (item) => await removeImage(item))
          )
    await Promise.all(      
      product.imagesSm.map(async (item) => await removeImage(item))
    )

    await Product.deleteOne({ _id: id })

    res.status(200).json({ message: "success" })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}
