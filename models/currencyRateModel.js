const mongoose=require('mongoose')

const currencyRateShema = mongoose.Schema({
  UAH: { type: Number, default: 1 }, 
  USD: { type: Number, default: 0 }, 
  EUR: { type: Number, default: 0 }  
}, {
  timestamps:true
})

const CurrencyRate=mongoose.model('CurrencyRate',currencyRateShema)

module.exports=CurrencyRate