const Order = require('../models/orderModel')
const asyncHandler = require("express-async-handler")

exports.addOrder = asyncHandler(async (req, res) => {
  const { user, orderItems, delivery, totalQnt, totalAmount,count } = req.body
  const order = await Order.create({
    user,orderItems,delivery,totalQnt,totalAmount,count
  })
  res.status(200).json({order})
} 
)

exports.getOrderById = asyncHandler(async (req, res) => {
  const { id } = req.params
  const order = await Order.findById(id)
  res.status(200).json({order})
  }    
)
exports.getOrderByUserId = asyncHandler(async (req, res) => {
    
  }    
)

exports.getOrderCount = asyncHandler(async (req, res) => {
  const orders = await Order.find()
  const count=orders.length?orders.sort((a,b)=>a.createdAt>b.createdAt?-1:1)[0].count:0
  res.status(200).json({count})
}
  

)
  

exports.getAllOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find()
  res.status(200).json({ orders })
  }    
)
  
exports.deleteOrder = asyncHandler(async (req, res) => {
  const { id } = req.params
  await Order.deleteOne({ _id: id })
  res.status(200).json({message:'ok'})
})