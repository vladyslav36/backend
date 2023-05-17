const express=require('express')
const router = express.Router()

const { getPrice, savePrice, deletePrice, getBarcods,getProduct }=require('../controllers/barcods')
const { protectAdmin, protect } = require('../middleware/auth')
router.route('/')
.get(getBarcods)
router
  .route("/:bc")
  .get(getPrice)
  .post(protect, protectAdmin, savePrice)
  .delete(protect, protectAdmin, deletePrice)
  router.route('/product/:bc').get(getProduct)

  module.exports=router