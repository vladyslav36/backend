const express=require('express')
const router = express.Router()
const { getAllProducts, getShowcaseProducts, addProducts, deleteProduct,getProduct,updateProduct } =require('../controllers/products')

router.route('/').get(getAllProducts).post(addProducts).put(updateProduct)

router.route('/showcase').get(getShowcaseProducts)

router.route('/:slug').get(getProduct)

router.route('/:id').delete(deleteProduct)



module.exports=router