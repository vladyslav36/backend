const mongoose = require("mongoose")
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

const path = require("path")

const fullPath = (path) => (path ? `https://karmen.kh.ua/image/${path}` : "")

dotenv.config({ path: "./config/.env" })



connectDb()

const migrate = async () => {
  const product = ocProduct[2].data.map((item) => ({
    product_id: item.product_id,
    model: item.model,
    images: [fullPath(item.image)],
    price: item.price,
  }))
  const productDescription = product_description[2].data.map((item) => ({
    product_id: item.product_id,
    name: item.name,
    description: item.description.replace(/[&lt;p&gtbr/san\r\n]/g, ""),
    title: item.meta_title,
    meta_description: item.meta_description,
  }))
  const productImage = product_image[2].data.map((item) => ({
    product_id: item.product_id,
    image: fullPath(item.image),
  }))

  const productToCategory = product_to_category[2].data.map((item) => ({
    product_id: item.product_id,
    category_id: item.category_id,
  }))

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

  // const resCategoryPath = category_path[2].data.map(item=>({
  //   category_id: item.category_id,
  //   path_id: item.path_id,
  //   level:item.level
  // }))

  // const totalRes = resProduct.map(item => {
  //   const id = item.product_id
  //   const addedItem = resProductDescription.find(item => item.product_id === id)
  //   const addedImages = resProductImage.filter(obj => obj.product_id === id).map(item2 => item2.image)
  //   const category_id = resProductToCategory.find(item => item.product_id === id)
  //   // const addCategory=category_description.find(item=>item.category_id===category_id)

  //   return {...item,...addedItem,images:[...item.images,...addedImages]}
  // })

  // all categories with no parents(level 0)

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
        dest:`.${newImage}`,
      }
      
       download.image(options).catch(error=>console.log(error))
      }
      
      await category.updateOne({
        parentCategoryId: parentNewId,
        parentCategory: parent ? parent.name : "",
        image: newImage,
      })
    })
  )

 

  process.exit()
}
migrate()
