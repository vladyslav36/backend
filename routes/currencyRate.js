const express = require("express")
const router = express.Router()
const { protect, protectAdmin } = require("../middleware/auth")
const { getCurrencyRate, addCurrencyRate }=require('../controllers/currencyRate')

router.route("/").get(getCurrencyRate).post(protect,protectAdmin, addCurrencyRate)

module.exports = router
