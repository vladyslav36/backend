const Product = require("../models/productModel")
const Category = require("../models/categoryModel")
const asyncHandler = require("express-async-handler")
const idToString = (id) => {
  return id === null ? "" : id.toString()
}
exports.setQntProducts = asyncHandler(async () => {
  const categories = await Category.find()
  const products = await Product.find()

  const qnt = categories.map( (category) => {
    let count = 0
    const qntProducts = (category) => {
      const children = categories.filter(
        (item) => idToString(item.parentCategoryId) === idToString(category._id)
      )
      if (children.length) {
        children.forEach((child) => {
          qntProducts(child)
        })
      } else {
        const prodInCategory = products.filter(
          (item) => idToString(item.categoryId) === idToString(category._id)
        )

        count += prodInCategory.length
      }
    }
    qntProducts(category)
    
    return { [category._id]: count }
    
  })
  //
  const idQnt= Object.assign({}, ...qnt)
  const keys=Object.keys(idQnt)
  await Promise.all(
    keys.map((key) =>
      Category.updateOne({ _id: key }, { qntProducts: idQnt[key] })
    )    
  )   
  
})
