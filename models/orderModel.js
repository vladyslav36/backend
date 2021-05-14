const mongoose =require( 'mongoose')

const orderSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref:'User'
  },
  orderItems: [
    {
      name:{type:String,required:true},
      qty:{type:Number,required:true},
      image:{type:String,required:true},
      price:{type:Number,required:true,default:0.0},
      currencyValue: { type: String, required: true },
      product: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref:'Product'
      }
    }
  ],
  shippingAddress: {    
    address: { type: String },
    city: { type: String,required:true },
    phoneNumber: { type: String, required: true },
    delliveryCompany: { type: String, required: true },
    branchNumber:{type:String}
  },
  paymentMethod: {
    type: String,
    required:true
  },
  totalPrice: {
    type: Number,
    required: true,
    default:0.0
  },
  isPaid: {
    type: Boolean,
    required: true,
    default:false
  },
  paidAt: {
    type:Date
  }
}, {
  timestamps:true
})

const Order = mongoose.model('Order', orderSchema)
module.exports = Order