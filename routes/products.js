const express = require("express")
const router = express.Router()
const { protect } = require("../middleware/auth")
const {
  getAllProducts,
  getShowcaseProducts,
  addProducts,
  deleteProduct,
  getProduct,
  updateProduct,
  getSearchProducts,
  getProductsNames,
  getProductsCategoryId,
  getEditSearchProducts,
} = require("../controllers/products")

router
  .route("/")
  .get(getAllProducts)
  .post( addProducts)
  .put( updateProduct)

router.route("/search").get(getSearchProducts)

router.route("/edit_search").get(getEditSearchProducts)

router.route("/category/:id").get(getProductsCategoryId)

router.route("/showcase").get(getShowcaseProducts)

router.route("/:slug").get(getProduct)

router.route("/:id").delete( deleteProduct)

module.exports = router
