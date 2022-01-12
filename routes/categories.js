const express = require('express')
const router = express.Router()
const { protect, protectAdmin }=require('../middleware/auth')
const {getAllCategories,addCategory,updateCategory,deleteCategory,getBrands } =require('../controllers/categories')

router
  .route('/')
  .get(getAllCategories)
  .post(protect,protectAdmin, addCategory)
  .put(protect,protectAdmin, updateCategory)

router
  .route('/brands')
.get(getBrands)

router.route('/:id')
  .delete(protect,protectAdmin, deleteCategory)

module.exports=router