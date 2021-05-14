const mongoose=require('mongoose')

const currencyRateShema = mongoose.Schema({
  usd_sale: { type: Number, default: 0 },
  usd_buy: { type: Number, default: 0 },
  eur_sale: { type: Number, default: 0 },
  eur_buy:{ type: Number, default: 0 }
}, {
  timestamps:true
})

const CurrencyRate=mongoose.model('CurrencyRate',currencyRateShema)

module.exports=CurrencyRate