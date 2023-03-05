const express = require('express')
const router = express.Router()
const { protect, protectAdmin }=require('../middleware/auth')
const {getAllCategories,addCategory,updateCategory,deleteCategory,getBrands,getCategoryById,getCategoryBySlug } =require('../controllers/categories')

router
  .route('/')
  .get(getAllCategories)
  // .post(protect,protectAdmin, addCategory)
  .post( addCategory)
  // .put(protect,protectAdmin, updateCategory)
  .put( updateCategory)

router
  .route('/brands')
.get(getBrands)

router.route('/:id')
  .get(getCategoryById)
  // .delete(protect, protectAdmin, deleteCategory)
  .delete( deleteCategory)

router.route('/slug/:slug')
  .get(getCategoryBySlug)
  
  // router.route('/options/:id').post(addOptions).delete(deleteOption)

module.exports=router