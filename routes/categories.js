const express = require('express')
const router = express.Router()
const {getAllCategories,addCategory,updateCategory,deleteCategory } =require('../controllers/categories')

router
  .route('/')
  .get(getAllCategories)
  .post(addCategory)
  .put(updateCategory)

router.route('/:id')
  .delete(deleteCategory)

module.exports=router