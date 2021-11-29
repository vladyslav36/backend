const { findOne } = require("../models/productModel")
const Product = require("../models/productModel")
const Category = require("../models/categoryModel")

const { getSlug } = require("../utils/getSlug")
const multer = require("multer")
const fs = require("fs-extra")
const path = require("path")
const {
  
  removeImage,
  
  resizeImage,
  
} = require("../utils/handleImages")
const asyncHandler = require("express-async-handler")
const { setQntProducts } = require("../utils/setQntProducts")


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

exports.getShowcaseProducts = asyncHandler(async (req, res, next) => {
  const showcaseProducts = await Product.find({ isShowcase: true })
  res.status(200).json({ showcaseProducts })
})
exports.getAllProducts = asyncHandler(async (req, res, next) => {
  const products = await Product.find()
  res.status(200).json({ products })
})
exports.getProductsCategoryId = asyncHandler(async (req, res, next) => {
  const categoryId = req.params.id
  const products = await Product.find({ categoryId })
  res.status(200).json({ products })
})


exports.getSearchProducts = asyncHandler(async (req, res) => {
  const { string } = req.query
  const products = await Product.find({
    $or: [
      { name: { $regex: string, $options: "i" } },
      { model: { $regex: string, $options: "i" } },
    ],
  }).limit(10)

  res.status(200).json({ products })
})
exports.getEditSearchProducts = asyncHandler(async (req, res) => {
  const { model, category, brand, name } = req.query
  // удаляем пустышки
  let searchObj = {}
  for (let key in req.query) {
    if (req.query[key]) searchObj[key] = req.query[key]
  }
  const products = await Product.find(searchObj).limit(10)

  res.status(200).json({ products })
})
exports.getProduct = asyncHandler(async (req, res, next) => {
  const { slug } = req.params   
  const product = await Product.findOne({ slug })  
  res.status(200).json({ product })
})
exports.addProducts = [
  multer({ storage }).array("images"),

  asyncHandler(async (req, res, next) => {
    const {
      name,
      model,
      brand,
      category,
      categoryId,      
      isShowcase,
      isInStock,
      description,
      options,
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
      slug,
      images,
      imagesMd,
      imagesSm,
      category,
      categoryId,      
      description,
      isShowcase,
      isInStock,
      options,
      price,
      retailPrice,
      currencyValue,
    })
    const data = await product.save()
    setQntProducts()
    res.status(200).json({ data })
  }),
]
exports.updateProduct = [
  multer({ storage }).array("images"),
  asyncHandler(async (req, res, next) => {
    const {
      _id,
      name,
      model,
      brand,
      category,
      categoryId,
      options,
      isShowcase,
      isInStock,
      description,
      price,
      retailPrice,
      currencyValue,
    } = JSON.parse(req.body.values)
    const imageClientPaths = JSON.parse(req.body.imageClientPaths)

    const slug = req.files.length
      ? path.parse(req.files[0].filename).name
      : getSlug(name)

    let count = 0
    const images = imageClientPaths.map((item, i) => {
      // условие разделяет ссылки на картинки старые и новые которые прилетают с фронта с "blob..."
      const isBlob = item.indexOf("blob") >= 0 ? true : false
      if (isBlob) {
        const newPath = `/${req.files[count].path.replace(/\\/g, "/")}`
        count++
        return newPath
      } else {
        // если ссылка на картинку осталась прежняя а название продукта изменилось,
        // этот блок создает новый слаг, состоящий из нового имени и старой второй части слага,
        // для всех трех картинок, вычисляет старый полный путь, новый полный путь и переименовывает все картинки
       
        const newSlug = `${slug.split("-")[0]}-${
          path.parse(item).name.split("-")[1]
        }`
        const newSlugMd = `${slug.split("-")[0]}-${
          path.parse(item).name.split("-")[1]
        }-md`
        const newSlugSm = `${slug.split("-")[0]}-${
          path.parse(item).name.split("-")[1]
        }-sm`
        const ext = path.extname(item)
        const ROOT_NAME = process.env.ROOT_NAME
        const dirName = `${ROOT_NAME}/upload/images/product`
        const oldPath = `${dirName}/${path.parse(item).name}${ext}`
        const oldPathMd = `${dirName}/${path.parse(item).name}-md${ext}`
        const oldPathSm = `${dirName}/${path.parse(item).name}-sm${ext}`

        const newPath = `${dirName}/${newSlug}${ext}`
        const newPathMd = `${dirName}/${newSlugMd}${ext}`
        const newPathSm = `${dirName}/${newSlugSm}${ext}`

        fs.rename(oldPath, newPath)
        fs.rename(oldPathMd, newPathMd)
        fs.rename(oldPathSm, newPathSm)

        return `/upload/images/product/${newSlug}${ext}`
      }
    })

    const product = await Product.findOne({ _id })
    const dbPaths = product.images
    //  удаление картинок, которые есть в базе но которых уже нет на фронте, т.е. пользователь из удалил
    dbPaths.forEach(async (item) => {
      if (!images.includes(item)) {
        const parsedPath = path.parse(item)

        await removeImage(item)
        await removeImage(
          `${path.dirname(item)}/${parsedPath.name}-md${parsedPath.ext}`
        )
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
        slug,
        images,
        imagesMd,
        imagesSm,
        category,
        categoryId,
        options,
        description,
        isShowcase,
        isInStock,
        price,
        retailPrice,
        currencyValue,
      }
    )
    setQntProducts()
    res.status(200).json({ msg: "Товар успешно обновлен" })
  }),
]
exports.deleteProduct = asyncHandler(async (req, res, next) => {
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
  setQntProducts()
  res.status(200).json({ message: "success" })
})
