const express = require("express")
const router = express.Router()
const { getCurrencyRate, addCurrencyRate }=require('../controllers/currencyRate')

router.route("/").get(getCurrencyRate).post(addCurrencyRate)

module.exports = router
