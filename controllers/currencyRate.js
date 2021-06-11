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
  const { USD, EUR } = req.body  
  try {
    const currencyRate = await CurrencyRate.findOne()
    currencyRate.USD = USD
    currencyRate.EUR=EUR
    const newRate = await currencyRate.save()    
     res.status(200).json( newRate )
  } catch (error) {
    return res.status(500).json({msg:'Server error'})
  }
 
  
 
}