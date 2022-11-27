const { getAllCatalogs, getCatalogById, addCatalog, deleteCatalog, updateCatalog } = require('../controllers/catalog')
const { protect, protectAdmin }=require('../middleware/auth')

const router =require('express').Router()

router.route('/')
  .get(getAllCatalogs)
  .post(protect,protectAdmin, addCatalog)
  .put(protect,protectAdmin, updateCatalog)

router.route('/:id')
  .get(getCatalogById)
  .delete(protect,protectAdmin, deleteCatalog)

  module.exports=router