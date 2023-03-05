const { getAllCatalogs, getCatalogById, addCatalog, deleteCatalog, updateCatalog } = require('../controllers/catalog')
const { protect, protectAdmin }=require('../middleware/auth')

const router =require('express').Router()

router.route('/')
  .get(getAllCatalogs)
  // .post(protect,protectAdmin, addCatalog)
  .post(addCatalog)
  // .put(protect,protectAdmin, updateCatalog)
  .put( updateCatalog)

router.route('/:id')
  .get(getCatalogById)
  // .delete(protect,protectAdmin, deleteCatalog)
  .delete( deleteCatalog)

  module.exports=router