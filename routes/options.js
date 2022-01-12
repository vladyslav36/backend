const express=require('express')
const router = express.Router()
const { protect, protectAdmin }=require('../middleware/auth')
const { getOptions, addOptions, updateOptions, deleteOptions,getOptionById, getOptionByBrandId }=require('../controllers/options')

router.route('/').get(getOptions).post(protect,protectAdmin, addOptions).put(protect, protectAdmin,updateOptions)

router.route('/:id').delete(protect,protectAdmin, deleteOptions).get(getOptionById)
router.route('/brandid/:id').get(getOptionByBrandId)
module.exports=router