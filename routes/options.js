const express=require('express')
const router = express.Router()
const { getOptions, addOptions, updateOptions, deleteOptions }=require('../controllers/options')

router.route('/').get(getOptions).post(addOptions).put(updateOptions)

router.route('/:id').delete(deleteOptions)

module.exports=router