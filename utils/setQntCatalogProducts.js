const Product = require("../models/productModel")
const Catalog=require('../models/catalogModel')
const asyncHandler = require("express-async-handler")

const { idToString } = require("./idToString")

exports.setQntCatalogProducts = asyncHandler(async () => {
  const catalogs = await Catalog.find()
  const products = await Product.find()

  const qnt = catalogs.map((catalog) => {
    let count = 0
    const qntProducts = (catalog) => {
      const children = catalogs.filter(
        (item) => idToString(item.parentId) === idToString(catalog._id)
      )
      if (children.length) {
        children.forEach((child) => {
          qntProducts(child)
        })
      } else {
        const prodInCategory = products.filter(
          (item) => idToString(item.catalogId) === idToString(catalog._id)
        )

        count += prodInCategory.length
      }
    }
    qntProducts(catalog)

    return { [catalog._id]: count }
  })
  //
  const idQnt = Object.assign({}, ...qnt)
  const keys = Object.keys(idQnt)
  await Promise.all(
    keys.map((key) =>
      Catalog.updateOne({ _id: key }, { qntProducts: idQnt[key] })
    )
  )
})
