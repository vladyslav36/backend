const express = require("express")
const router = express.Router()
const { protect, protectAdmin } = require("../middleware/auth")
const {
  getAllProducts,
  getShowcaseProducts,
  addProducts,
  deleteProduct,
  getProduct,
  updateProduct,
  getSearchProducts,  
  getProductsCategoryId,
  getEditSearchProducts,
  
} = require("../controllers/products")

router
  .route("/")
  .get(getAllProducts)
  .post(protect,protectAdmin, addProducts)
  .put(protect,protectAdmin, updateProduct)

router.route("/search").get(getSearchProducts)

router.route("/edit_search").get(getEditSearchProducts)

router.route("/category/:id").get(getProductsCategoryId)

router.route("/showcase").get(getShowcaseProducts)

router.route("/:slug").get(getProduct)

router.route("/:id").delete(protect,protectAdmin, deleteProduct)

module.exports = router
