const CurrencyRate=require('../models/currencyRateModel')

exports.getCurrencyRate = async (req, res, next) => {
  try {
    const currencyRate = await CurrencyRate.findOne()
    res.status(200).json({currencyRate})
  } catch (error) {
    return res.status(500).json({ msg: "Server error" })
  }
}

exports.addCurrencyRate = async (req, res, next) => {
  
}