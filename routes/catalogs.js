const { getAllCatalogs, getCatalogById, addCatalog, deleteCatalog, updateCatalog } = require('../controllers/catalog')

const router =require('express').Router()

router.route('/')
  .get(getAllCatalogs)
  .post(addCatalog)
  .put(updateCatalog)

router.route('/:id')
  .get(getCatalogById)
  .delete(deleteCatalog)

  module.exports=router