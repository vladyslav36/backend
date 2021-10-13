const express = require('express')
const router = express.Router()
const { sendMail }=require('../controllers/cart')

router.route('/mail').post(sendMail)

module.exports=router