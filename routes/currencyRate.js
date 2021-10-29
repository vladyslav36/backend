const express = require("express")
const router = express.Router()
const { protect } = require("../middleware/auth")
const { getCurrencyRate, addCurrencyRate }=require('../controllers/currencyRate')

router.route("/").get(getCurrencyRate).post(protect,addCurrencyRate)

module.exports = router
