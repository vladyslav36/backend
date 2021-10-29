const express=require('express')
const router = express.Router()
const { protect }=require('../middleware/auth')
const { getAllBrands, addBrand, updateBrand, deleteBrand }=require('../controllers/brands')

router.route('/')
  .get(getAllBrands)
  .post(protect, addBrand)
  .put(protect,updateBrand)

router.route('/:id')
  .delete(protect,deleteBrand)

  module.exports=router