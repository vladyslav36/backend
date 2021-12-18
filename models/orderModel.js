const mongoose =require( 'mongoose')

const orderSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default:null
    },
    orderItems: [
      {
        name: { type: String, required: true },        
        options: { type: Object },        
        currencyValue: { type: String, required: true },
        price: String,
        qnt:String
      },
    ],
    delivery: {
      name: String,
      surname: String,
      phone: String,
      city: String,
      carrier: String,
      branch: String,
      pickup: { type: Boolean, default: true },
      prepaid: { type: Boolean, default: true }
    },
    totalQnt: String,
    totalAmount: String,
    count:{type:Number,default:0}
  },
  {
    timestamps: true,
  }
)

const Order = mongoose.model('Order', orderSchema)
module.exports = Order