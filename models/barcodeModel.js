const mongoose=require('mongoose')

const barcodeSchema = mongoose.Schema({
  barcode: {
    type: String,
    default: '',
    unique:true
  },
  price: {
    type: String,
    default:''
  }
})

module.exports=mongoose.model('Barcode',barcodeSchema)