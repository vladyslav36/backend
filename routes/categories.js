const express = require("express")
const router = express.Router()
const { protect, protectAdmin } = require("../middleware/auth")
const {
  getAllCategories,
  addCategory,
  updateCategory,
  deleteCategory,
  getBrands,
  getCategoryById,
  getCategoryBySlug,
  getNavbarData,
} = require("../controllers/categories")

router
  .route("/")
  .get(getAllCategories)
  .post(protect, protectAdmin, addCategory)

  .put(protect, protectAdmin, updateCategory)

router.route("/brands").get(getBrands)
router.route("/navbar").get(getNavbarData)

router
  .route("/:id")
  .get(getCategoryById)
  .delete(protect, protectAdmin, deleteCategory)

router.route("/slug/:slug").get(getCategoryBySlug)


// router.route('/options/:id').post(addOptions).delete(deleteOption)

module.exports = router
