const express = require("express")
const router = express.Router()

const {
  getBrands,
  getProductsModels,
  getProductsNames,
  getCategories,
} = require("../controllers/search")

router.route("/list_names/brand").get(getBrands)
router.route("/list_names/category").get(getCategories)
router.route("/list_names/model").get(getProductsModels)
router.route("/list_names/name").get(getProductsNames)

module.exports = router
