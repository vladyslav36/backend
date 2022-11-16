const { getAllCatalogs, getCatalogById, addCatalog, deleteCatalog, updateCatalog } = require('../controllers/catalog')

const router =require('express').Router()

router.route('/')
  .get(getAllCatalogs)
  .post(addCatalog)

router.route('/:id')
  .get(getCatalogById)
  .put(updateCatalog)
  .delete(deleteCatalog)

  module.exports=router