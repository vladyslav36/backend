const mongoose = require("mongoose")
const fs = require("fs-extra")
const path = require("path")
const ocProduct = require("./ocst_product.json")
const product_description = require("./ocst_product_description.json")
const product_image = require("./ocst_product_image.json")
const product_to_category = require("./ocst_product_to_category.json")
const ocCategory = require("./ocst_category.json")
const category_description = require("./ocst_category_description.json")
const product_option = require("./ocst_product_option.json")
const ocOption = require("./ocst_option.json")
const option_value = require("./ocst_option_value.json")
const option_value_description = require("./ocst_option_value_description.json")
const option_description = require("./ocst_option_description.json")
const category_path = require("./ocst_category_path.json")
const { getSlug } = require("../utils/getSlug")
const Category = require("../models/categoryModel")
const Product = require("../models/productModel")
const dotenv = require("dotenv")
const connectDb = require("../config/db")
const download = require("image-downloader")
const sharp = require("sharp")
const { getBrand } = require("../utils/getBrand")
const { setQntProducts } = require("../utils/setQntProducts")


const fullPath = (path) => (path ? `https://karmen.kh.ua/image/${path}` : "")

dotenv.config({ path: "./config/.env" })

const ROOT_NAME = path
  .dirname(__filename)
  .replace(/\\/g, "/")
  .split("/")
  .slice(0, -1)
  .join("/")

const migrate = async () => {
  await connectDb()
  // ***********************************************************
  // migrate categories
  // ***********************************************************
  await fs.emptyDir("./upload/images/category")
  await Category.deleteMany()

  const category = ocCategory[2].data.map((item) => ({
    category_id: item.category_id,
    image: fullPath(item.image),
    parent_id: item.parent_id,
  }))

  const categoryDescription = category_description[2].data.map((item) => ({
    category_id: item.category_id,
    name: item.name,
    meta_title: item.meta_title,
  }))

  const id_newId_array = await Promise.all(
    category.map(async (item) => {
      const { category_id, image } = item
      const { name, meta_title: description } = categoryDescription.find(
        (item) => item.category_id === category_id
      )

      const slug = getSlug(name)
      const { _id } = await Category.create({
        name,
        description,
        image,
        slug,
      })
      return { [category_id]: _id }
    })
  )
  const id_newId = Object.assign({}, ...id_newId_array)

  await Promise.all(
    category.map(async (item) => {
      const { category_id, parent_id } = item

      const categoryNewId = id_newId[category_id]
      const parentNewId = id_newId[parent_id]

      const category = await Category.findById(categoryNewId)
      const parent = await Category.findById(parentNewId)

      const image = category.image
      const slug = category.slug
      const ext = path.extname(image)
      const newImage = `/upload/images/category/${slug}${ext}`
      if (image) {
        const options = {
          url: image,
          dest: `.${newImage}`,
        }

        download.image(options).catch((error) => console.log(error))
      }

      await category.updateOne({
        parentCategoryId: parentNewId,
        parentCategory: parent ? parent.name : "",
        image: newImage,
      })
    })
  )

  // **********************************************************
  // migrate products
  // **********************************************************

  // console.log(id_newId)
  await fs.emptyDir("./upload/images/product")
  await Product.deleteMany()

  const currency_id_value = {
    0: "UAH",
    6: "USD",
    7: "EUR",
  }
  const product = ocProduct[2].data.map((item) => ({
    product_id: item.product_id,
    model: item.model,
    images: [fullPath(item.image)],
    currencyValue: currency_id_value[item.currency_id],
    price: (+item.price).toFixed(2),
  }))
  //  console.log(product[0])

  const productDescription = product_description[2].data.map((item) => ({
    product_id: item.product_id,
    name: item.name,
    description: item.description.replace(/[&lt;p&gtbr/san\r\n]/g, ""),
  }))
  // console.log(productDescription[0])

  const productImage = product_image[2].data.map((item) => ({
    product_id: item.product_id,
    image: fullPath(item.image),
  }))

  // console.log(productImage[0])

  const productToCategory = product_to_category[2].data.map((item) => ({
    product_id: item.product_id,
    category_id: item.category_id,
  }))
  const new_product = await Promise.all(
    product.map(async (item) => {
      const model = item.model
      const { name, description } =
        productDescription.find(
          (elem) => elem.product_id === item.product_id
        ) || {}
      const images = [
        ...item.images,
        ...productImage
          .filter(({ product_id }) => product_id === item.product_id)
          .map((prod) => prod.image),
      ]

      const isShowcase = false
      const isInStock = true

      const category_id = (
        productToCategory.find((prod) => item.product_id === prod.product_id) ||
        {}
      ).category_id

      const categoryId = id_newId[category_id]

      const category = await Category.findById(categoryId)
      const categories = await Category.find()
      const brand = getBrand(category, categories)
      const newImages = await Promise.all(
        images.map(async (image) => {
          if (name && image) {
            const slug = getSlug(name)
            // console.log(image)
            const newImage = `/upload/images/product/${slug}${path.extname(
              image
            )}`
            const newImageMd = `/upload/images/product/${slug}-md${path.extname(
              image
            )}`
            const newImageSm = `/upload/images/product/${slug}-sm${path.extname(
              image
            )}`

            await download.image({ url: image, dest: `.${newImage}` })

            await sharp(`.${newImage}`)
              .resize({ width: 50 })
              .toFile(`.${newImageSm}`)
            await sharp(`.${newImage}`)
              .resize({ width: 200 })
              .toFile(`.${newImageMd}`)

            return { newImage, newImageSm, newImageMd }
          } else {
            return { newImage: "", newImageSm: "", newImageMd: "" }
          }
        })
      )
      const slug = path.parse(newImages[0].newImage).name

      if (name && model) {
        await Product.create({
          product_id: item.product_id,
          categoryId: categoryId ? categoryId : null,
          category: category ? category.name : "",
          brand: brand ? brand.name : "",
          brandId: brand ? brand._id : null,
          price: item.price,
          currencyValue: item.currencyValue,
          name,
          model,
          description,
          images: newImages.map((item) => item.newImage),
          imagesMd: newImages.map((item) => item.newImageMd),
          imagesSm: newImages.map((item) => item.newImageSm),
          isShowcase,
          isInStock,
          slug,
        })
      }

      return {
        product_id: item.product_id,
        categoryId: categoryId ? categoryId : null,
        category: category ? category.name : "",
        brand: brand ? brand.name : "",
        brandId: brand ? brand._id : null,
        name,
        model,
        description,
        images: newImages.map((item) => item.newImage),
        imagesMd: newImages.map((item) => item.newImageMd),
        imagesSm: newImages.map((item) => item.newImageSm),
        isShowcase,
        isInStock,
        slug,
      }
    })
  )
  // console.log(new_product)
  await setQntProducts()

  // ******************************************************
  // migrate options
  // ******************************************************

  process.exit()
}

// migrate()

const migrateOptions = async () => {
  await connectDb()

  const productOption = product_option[2].data.map((item) => ({
    product_option_id: item.product_option_id,
    product_id: item.product_id,
    option_id: item.option_id,
  }))
  // console.log(productOption)
  const option = ocOption[2].data.map((item) => ({
    option_id: item.option_id,
  }))
  // console.log(option)

  const optionValue = option_value[2].data.map((item) => ({
    option_value_id: item.option_value_id,
    option_id: item.option_id,
  }))

  // console.log(optionValue)

  const optionValueDescription = option_value_description[2].data.map(
    (item) => ({
      option_value_id: item.option_value_id,
      option_id: item.option_id,
      name: item.name,
    })
  )

  // console.log(optionValueDescription)

  const optionDescription = option_description[2].data.map((item) => ({
    option_id: item.option_id,
    name: item.name,
  }))

  // console.log(optionDescription)

  const values = option.map((item) => {
    const optionId = item.option_id
    const optionValues = optionValueDescription
      .filter((item) => item.option_id === optionId)
      .map((item) => item.name)
    return { [optionId]: optionValues }
  })
  const id_values = Object.assign({}, ...values)
  // console.log(id_values)
  
  const brands = await Category.find({ parentCategoryId: null })
  await Promise.all(
    brands.map(async (brand) => {
      const getOptions = (value_id) => {
        // {Цвет:21,Размер:14}

        const optionsArray = Object.keys(value_id).map((item) => {
          const array = id_values[value_id[item]].sort().map((value) => ({
            [value]: {
              price: "",
              checked: false,
            },
          }))
          return {
            [item]: {
              isChangePrice: false,
              values: Object.assign({}, ...array),
            },
          }
        })
        const options = Object.assign({}, ...optionsArray) //{'Цвет': {anthracite: {  },beige: { },...},'Размер': {0:{ },1:{ },...} }
        return options
      }

      // const saveOptions = async (brand, options) => {
      //   const option = new Options({
      //     brandId: brand._id,
      //     name: brand.name,
      //     options: {},
      //   })
      //   // Двойное сохранение с целью возможности сохранения ключа с точкой
      //   await option.save()
      //   option.options = options
      //   await option.save()
      // }

      const saveOptions = async (brand, options) => {
        await Category.updateOne({ _id: brand._id },{options})
        
      }
      // options Conte
      if (brand.name === "Conte") {
        const options = getOptions({ Цвет: 21, Размер: 14 })
      await  saveOptions(brand, options)
      }
      // options Легка хода
      if (brand.name === "Легка Хода") {
        const options = getOptions({ Цвет: 23, Размер: 14 })

      await  saveOptions(brand, options)
      }
      // options Ника
      if (brand.name === "Ника") {
        const options = getOptions({
          Цвет: 13,
          Размер: 14,
          "Объем бедер": 17,
          Упаковка: 16,
        })

      await  saveOptions(brand, options)
      }
      // options Брест
      if (brand.name === "Брест") {
        const options = getOptions({
          Цвет: 22,
          Размер: 14,
        })
        saveOptions(brand, options)
      }
      // options Esli
      if (brand.name === "Esli") {
        const options = getOptions({
          Цвет: 21,
          Размер: 14,
        })

      await  saveOptions(brand, options)
      }
      // options Katherina_Lores_Dolores
      if (brand.name === "Katherina_Lores_Dolores") {
        const options = getOptions({
          Цвет: 24,
          Размер: 14,
        })

      await  saveOptions(brand, options)
      }

      if (brand.name === "Хатка") {
        const options = getOptions({
          Цвет: 25,
          Размер: 14,
        })
      await  saveOptions(brand, options)
      }

      if (brand.name === "Mio Senso") {
        const options = getOptions({
          Цвет: 28,
          Размер: 14,
        })
      await  saveOptions(brand, options)
      }
      if (brand.name === "Aleksandra") {
        const options = getOptions({
          Размер: 14,
        })
      await  saveOptions(brand, options)
      }

      if (brand.name === "Anna") {
        const options = getOptions({
          Цвет: 29,
          Размер: 14,
        })
      await  saveOptions(brand, options)
      }
      if (brand.name === "Marilyn") {
        const options = getOptions({
          Цвет: 30,
          Размер: 14,
        })
      await  saveOptions(brand, options)
      }
      if (brand.name === "Knittex") {
        const options = getOptions({
          Цвет: 31,
          Размер: 14,
        })
      await  saveOptions(brand, options)
      }
      if (brand.name === "Arti Katamino") {
        const options = getOptions({
          Цвет: 32,
          Размер: 14,
        })
      await  saveOptions(brand, options)
      }
    })
  )
  process.exit()
}

migrateOptions()
