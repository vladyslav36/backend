const express=require('express')
const router = express.Router()
const { getAllProducts, getShowcaseProducts, addProducts, deleteProduct } =require('../controllers/products')

router.route('/').get(getAllProducts).post(addProducts)

router.route('/showcase').get(getShowcaseProducts)



router.route('/:id').delete(deleteProduct)



module.exports=router