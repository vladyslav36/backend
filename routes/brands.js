const express=require('express')
const router = express.Router()
const { getAllBrands, addBrand, updateBrand, deleteBrand }=require('../controllers/brands')

router.route('/')
  .get(getAllBrands)
  .post(addBrand)
  .put(updateBrand)

router.route('/:id')
  .delete(deleteBrand)

  module.exports=router