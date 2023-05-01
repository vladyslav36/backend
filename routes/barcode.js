const express=require('express')
const router = express.Router()

const { getPrice, savePrice, deletePrice }=require('../controllers/barcods')
const { protectAdmin, protect } = require('../middleware/auth')

router
  .route("/:bc")
  .get(getPrice)
  .post(protect, protectAdmin, savePrice)
  .delete(protect, protectAdmin, deletePrice)
  

  module.exports=router