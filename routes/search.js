const express = require("express")
const router = express.Router()

const {
  
  getProductsModels,
  getProductsNames,
  getCategories,
  getBrands
} = require("../controllers/search")


router.route("/list_names/category").post(getCategories)
router.route("/list_names/brand").post(getBrands)
router.route("/list_names/model").post(getProductsModels)
router.route("/list_names/name").post(getProductsNames)

module.exports = router
