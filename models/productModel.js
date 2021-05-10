import mongoose from 'mongoose'

const productSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,   
    ref:'User'
  },
  name: {
    type: String,
    required:true
  },
  brand: {
    type: String,
    required:true
  },
  model: {
    type: String,
    required:true
  },
  category: {
    type: String,
    required:true
  },
  title: {
    type: String,
    required:true
  },
  description: {
    type:String
  },
  price: {
    type: Number,
    required: true,
    default:0
  },
  currencyValue: {
    type: String,
    required: true,
    default:'UAH'
  },
  countInStock: {
    type: Number,
    required: true,
    default:100
  }
},
  {
    timestamps:true
  })

const Product = mongoose.model('Product', productSchema)
  
export default Product