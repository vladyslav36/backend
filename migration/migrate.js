const mongoose = require("mongoose")
const fs = require("fs-extra")
const path = require("path")
const ocProduct = require("./ocst_product.json")
const product_description = require("./ocst_product_description.json")
const product_image = require("./ocst_product_image.json")
const product_to_category = require("./ocst_product_to_category.json")
const ocCategory = require("./ocst_category.json")
const category_description = require("./ocst_category_description.json")
const category_path = require("./ocst_category_path.json")
const { getSlug } = require("../utils/getSlug")
const Category = require("../models/categoryModel")
const dotenv = require("dotenv")
const connectDb = require("../config/db")
const download = require("image-downloader")
const sharp=require('sharp')

const fullPath = (path) => (path ? `https://karmen.kh.ua/image/${path}` : "")

dotenv.config({ path: "./config/.env" })

//  connectDb()

const ROOT_NAME = path
  .dirname(__filename)
  .replace(/\\/g, "/")
  .split("/")
  .slice(0, -1)
  .join("/")
console.log(ROOT_NAME)
const migrateProducts = async () => {
  await connectDb()
  const product = ocProduct[2].data.map((item) => ({
    product_id: item.product_id,
    model: item.model,
    images: [fullPath(item.image)],
    price: item.price,
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
      
      const newImages =await Promise.all(images.map(async (image) => {
        if (name && image) {
          const slug = getSlug(name)
          console.log(image)
          const newImage = `/upload/images/product/${slug}${path.extname(image)}`
          const newImageMd = `/upload/images/product/${slug}-md${path.extname(image)}`
          const newImageSm = `/upload/images/product/${slug}-sm${path.extname(image)}`
          
        //   await download.image({ url: image, dest: `.${newImage}` })

        //  await  sharp(`.${newImage}`)
        //     .resize({ width: 50 })
        //     .toFile(`.${newImageSm}`)
        //  await  sharp(`.${newImage}`)
        //     .resize({ width: 200 })
        //     .toFile(`.${newImageMd}`)
          
          return { newImage, newImageSm, newImageMd }
        } else {
          return { newImage:'', newImageSm:'', newImageMd:'' }
        }
      }))
      const slug=path.parse(newImages[0].newImage).name
      return {
        name,
        model,
        description,
        images: newImages.map((item) => item.newImage),
        imagesMd: newImages.map((item) => item.newImageMd),
        imagesSd: newImages.map((item) => item.newImageSm),
        isShowcase,
        isInStock,
        slug,
      }
    })
  )
  console.log(new_product)
  process.exit()
}
const migrateCategory = async () => {
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
}

migrateProducts()
//  process.exit()
