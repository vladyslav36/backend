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
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    default:null
  },
  crumbsArr: []
}, {
  minimize:false
})

module.exports=mongoose.model('Barcode',barcodeSchema)