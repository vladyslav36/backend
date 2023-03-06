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
  getProductsCatalogId,
  getEditSearchProducts,
  
} = require("../controllers/products")

router
  .route("/")
  .get(getAllProducts)
  .post(protect,protectAdmin, addProducts)
 
  .put(protect,protectAdmin, updateProduct)
 

router.route("/search").get(getSearchProducts)

router.route("/edit_search").post(getEditSearchProducts)

router.route("/category/:id").get(getProductsCategoryId)
router.route("/catalog/:id").get(getProductsCatalogId)

router.route("/showcase").get(getShowcaseProducts)

router.route("/:slug").get(getProduct)

router.route("/:id").delete(protect,protectAdmin, deleteProduct)


module.exports = router
