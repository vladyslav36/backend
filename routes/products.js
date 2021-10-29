const express=require('express')
const router = express.Router()
const { protect } = require("../middleware/auth")
const { getAllProducts, getShowcaseProducts, addProducts, deleteProduct,getProduct,updateProduct,getSearchProducts, getProductsNames,getProductsCategoryId } =require('../controllers/products')

router.route('/').get(getAllProducts).post(protect,addProducts).put(protect,updateProduct)

router.route('/search').get(getSearchProducts)

router.route('/category/:id').get(getProductsCategoryId)

router.route('/names').get(getProductsNames)

router.route('/showcase').get(getShowcaseProducts)

router.route('/:slug').get(getProduct)

router.route('/:id').delete(protect,deleteProduct)



module.exports=router