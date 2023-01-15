const Product = require("../models/productModel")
const { getSlug } = require("../utils/getSlug")
const path = require("path")
const sharp = require("sharp")
const { removeImage } = require("../utils/handleImages")
const asyncHandler = require("express-async-handler")
const { setQntProducts } = require("../utils/setQntProducts")
const { setQntCatalogProducts } = require("../utils/setQntCatalogProducts")

exports.getShowcaseProducts = asyncHandler(async (req, res, next) => {
  const showcaseProducts = await Product.find({ isShowcase: true })
  res.status(200).json({ showcaseProducts })
})
exports.getAllProducts = asyncHandler(async (req, res, next) => {
  const products = await Product.find()
  res.status(200).json({ products })
})
exports.getProductsCategoryId = asyncHandler(async (req, res) => {
  const categoryId = req.params.id
  const products = await Product.find({ categoryId })
  res.status(200).json({ products })
})
exports.getProductsCatalogId = asyncHandler(async (req, res) => {
  const catalogId = req.params.id
  const products = await Product.find({ catalogId })
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
  // удаляем пустышки
  let searchObj = {}
  for (let key in req.body) {
    if (req.body[key]) searchObj[key] = req.body[key]
  }
  const products = await Product.find(searchObj)
  res.status(200).json({ products })
})
exports.getProduct = asyncHandler(async (req, res, next) => {
  const { slug } = req.params
  const product = await Product.findOne({ slug }).populate("categoryId brandId catalogId")

  res.status(200).json({ product })
})
exports.addProducts = asyncHandler(async (req, res) => {
  const {
    name,
    model,
    brand,
    brandId,
    category,
    categoryId,
    catalogId,
    isShowcase,
    isInStock,
    description,
    options,
    price,
    retailPrice,
    currencyValue,
  } = JSON.parse(req.body.values)
  const root = process.env.ROOT_NAME
  const slug = getSlug(name)
  const productPath = "/upload/images/product"
  let images = []
  let imagesMd = []
  let imagesSm = []
  if (req.files != null) {
    const files = Array.isArray(req.files.images)
      ? req.files.images
      : [req.files.images]

    const newImages = await Promise.all(
      files.map(async (file) => {
        const fileName = path.parse(file.name).name
        const fileExt = path.parse(file.name).ext
        const slug = getSlug(fileName)
        const image = `${productPath}/${slug}${fileExt}`
        const imageSm = `${productPath}/${slug}-sm${fileExt}`
        const imageMd = `${productPath}/${slug}-md${fileExt}`
        await file.mv(`${root}${image}`)
        await sharp(`${root}${image}`)
          .resize({ width: 200 })
          .toFile(`${root}${imageMd}`)
        await sharp(`${root}${image}`)
          .resize({ width: 50 })
          .toFile(`${root}${imageSm}`)
        return { image, imageSm, imageMd }
      })
    )
    images = newImages.map((item) => item.image)
    imagesSm = newImages.map((item) => item.imageSm)
    imagesMd = newImages.map((item) => item.imageMd)
  }

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
    catalogId,
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
  setQntCatalogProducts()
  res.status(200).json({ data })
})
exports.updateProduct = asyncHandler(async (req, res) => {
  const {
    _id,
    name,
    model,
    brand,
    brandId,
    category,
    categoryId,
    catalogId,
    options,
    isShowcase,
    isInStock,
    description,
    price,
    retailPrice,
    currencyValue,
  } = JSON.parse(req.body.values)

  const imageClientPaths = JSON.parse(req.body.imageClientPaths)
  const root = process.env.ROOT_NAME
  const slug = getSlug(name)
  const productPath = "/upload/images/product"
  let images = []
  let imagesSm = []
  let imagesMd = []
  // Картинки noBlob это картинки с базы которые не менялись
  const noBlob = imageClientPaths
    .filter((imagePath) => !imagePath.startsWith("blob"))
    .map((item) => `${productPath}/${path.basename(item)}`)
  const noBlobSm = noBlob.map(
    (item) =>
      `${productPath}/${path.parse(item).name}-sm${path.parse(item).ext}`
  )
  const noBlobMd = noBlob.map(
    (item) =>
      `${productPath}/${path.parse(item).name}-md${path.parse(item).ext}`
  )

  // если новых картинок нет
  if (req.files === null) {
    if (imageClientPaths.length) {
      images = [...noBlob]
      imagesSm = [...noBlobSm]
      imagesMd = [...noBlobMd]
    }
    // если новые картинки есть
  } else {
    const files = Array.isArray(req.files.images)
      ? req.files.images
      : [req.files.images]
    const newImages = await Promise.all(
      files.map(async (file) => {
        const name = path.parse(file.name).name
        const ext = path.parse(file.name).ext
        const slug = getSlug(name)
        const image = `${productPath}/${slug}${ext}`
        const imageSm = `${productPath}/${slug}-sm${ext}`
        const imageMd = `${productPath}/${slug}-md${ext}`
        await file.mv(`${root}${image}`)
        await sharp(`${root}${image}`)
          .resize({ width: 200 })
          .toFile(`${root}${imageMd}`)
        await sharp(`${root}${image}`)
          .resize({ width: 50 })
          .toFile(`${root}${imageSm}`)
        return { image, imageSm, imageMd }
      })
    )
    images = [...noBlob, ...newImages.map((item) => item.image)]
    imagesSm = [...noBlobSm, ...newImages.map((item) => item.imageSm)]
    imagesMd = [...noBlobMd, ...newImages.map((item) => item.imageMd)]
  }

  const product = await Product.findById(_id)
  // удаление картинок которые есть в базе но нет среди нужных
  await Promise.all(
    product.images.map(async (item) => {
      if (!images.includes(item)) {
        await removeImage(item)
      }
    })
  )
  await Promise.all(
    product.imagesSm.map(async (item) => {
      if (!imagesSm.includes(item)) {
        await removeImage(item)
      }
    })
  )
  await Promise.all(
    product.imagesMd.map(async (item) => {
      if (!imagesMd.includes(item)) {
        await removeImage(item)
      }
    })
  )

  const productUp=await Product.findOneAndUpdate(
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
      catalogId,
      options,
      description,
      isShowcase,
      isInStock,
      price,
      retailPrice,
      currencyValue,
    },{new:true}
  )

  setQntProducts()
  setQntCatalogProducts()  
  res.status(200).json({product:productUp })
})
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
    setQntCatalogProducts()
    res.status(200).json({ message: "success" })
  })
