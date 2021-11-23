const express = require('express')
const router = express.Router()
const { protect }=require('../middleware/auth')
const {getAllCategories,addCategory,updateCategory,deleteCategory,getBrands } =require('../controllers/categories')

router
  .route('/')
  .get(getAllCategories)
  .post(addCategory)
  .put(updateCategory)

router
  .route('/brands')
.get(getBrands)

router.route('/:id')
  .delete(deleteCategory)

module.exports=router