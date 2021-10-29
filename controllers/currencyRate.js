const CurrencyRate = require("../models/currencyRateModel")
const asyncHandler = require("express-async-handler")

exports.getCurrencyRate = asyncHandler(async (req, res, next) => {
  const currencyRate = await CurrencyRate.findOne()
  res.status(200).json({ currencyRate })
})

exports.addCurrencyRate = asyncHandler(async (req, res, next) => {
  const { USD, EUR } = req.body
  const currencyRate = await CurrencyRate.findOne()
  currencyRate.USD = USD
  currencyRate.EUR = EUR
  const newRate = await currencyRate.save()
  res.status(200).json(newRate)
})
