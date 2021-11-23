const express=require('express')
const router = express.Router()
const { getOptions, addOptions, updateOptions, deleteOptions,getOptionById, getOptionByBrandId }=require('../controllers/options')

router.route('/').get(getOptions).post(addOptions).put(updateOptions)

router.route('/:id').delete(deleteOptions).get(getOptionById)
router.route('/brandid/:id').get(getOptionByBrandId)
module.exports=router