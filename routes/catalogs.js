const { getAllCatalogs, getCatalogById } = require('../controllers/catalog')

const router =require('express').Router()

router.route('/')
  .get(getAllCatalogs)

router.route('/:id')
  .get(getCatalogById)

  module.exports=router