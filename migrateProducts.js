const mongoose = require("mongoose")
const dotenv = require("dotenv")
const connectDb = require("./config/db")
const Product = require("./models/productModel")
const Category = require("./models/categoryModel")

dotenv.config({ path: "./config/.env" })
connectDb()



const migrateOptions = async () => {
  // const product = (
  //   await Product.findOne({ _id: "624460cb234bf030a881f164" })
  // ).toJSON()

  const products = await Product.find()

  const newProducts = await Promise.all(
    products.map(async (item) => {
      const product = item.toJSON()
      if (!product.hasOwnProperty("options")) return
      if (product.brandId === null) return
      const brand = await Category.findOne({ _id: product.brandId })

      const ownOptions = Object.assign(
        {},
        ...Object.keys(brand.options)
          .sort()
          .map((item) => {
            if (product.options.hasOwnProperty(item)) {
              return {
                [item]: Object.keys(product.options[item]).sort(),
              }
            } else {
              return {
                [item]: [],
              }
            }
          })
      )

      const fillingOwnOptions = Object.assign(
        {},
        ...Object.keys(ownOptions)
          .filter((item) => ownOptions[item].length)
          .map((item) => ({ [item]: ownOptions[item].sort() }))
      )

      let priceTable = { price: "", barcode: "" }

      Object.keys(fillingOwnOptions)
        .reverse()
        .forEach((option) => {
          priceTable = Object.assign(
            {},
            ...fillingOwnOptions[option].map((value) => ({
              [value]: JSON.parse(JSON.stringify(priceTable)),
            }))
          )
        })

      if (
        !Object.keys(product.options).length ||
        !Object.keys(fillingOwnOptions).length
      ) {
        const savePrice = (optionValues) => {
          if (optionValues.hasOwnProperty("price")) {
            optionValues["price"] = product.price
            return
          } else {
            Object.keys(optionValues).forEach((item) => {
              savePrice(optionValues[item])
            })
          }
        }

        savePrice(priceTable)
      } else {
        const option = Object.keys(fillingOwnOptions)[0]

        Object.keys(product.options[option]).map((item) => {
          if (priceTable[item].hasOwnProperty("price")) {
            priceTable[item]["price"] = product.options[option][item]["price"]
            return
          } else {
            Object.keys(priceTable[item]).forEach((key) => {
              priceTable[item][key]["price"] =
                product.options[option][item]["price"]
            })
          }
        })
      }
      // product.ownOptions = ownOptions
      // product.optionValues = priceTable
      await Product.findOneAndUpdate(
        { _id: product._id },
        { ownOptions,optionValues:priceTable }
      )
      return product
      // console.log(priceTable)
    })
  )
  process.exit()
}

// migrateOptions()

const changeOptionsOrder = async () => {
  const brands = await Category.find({ parentId: null })
  brands.map(async item => {
    const brand = item.toJSON()
    const newOptions = {}
    Object.keys(brand.options).sort().forEach(option => {
      
      newOptions[option]=brand.options[option]
    })
    await Category.findOneAndUpdate({ _id: brand._id },{options:newOptions})
  })
}

// changeOptionsOrder()

const resetFields = async () => {
  const products = await Product.find()
  await Promise.all(products.map(async item => {
    await Product.findOneAndUpdate({_id:item._id},{$unset:{price:1,isInStock:1,retailPrice:1,options:1}})
  }))
  process.exit()
}

resetFields()