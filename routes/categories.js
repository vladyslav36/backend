const express = require('express')
const router = express.Router()
const { protect }=require('../middleware/auth')
const {getAllCategories,addCategory,updateCategory,deleteCategory } =require('../controllers/categories')

router
  .route('/')
  .get(getAllCategories)
  .post(protect,addCategory)
  .put(protect,updateCategory)

router.route('/:id')
  .delete(protect,deleteCategory)

module.exports=router