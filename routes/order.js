const { addOrder, getOrderById, getAllOrders, getOrderByUserId, deleteOrder } = require('../controllers/order')
const { protect, protectAdmin }=require('../middleware/auth')

const router = require('express').Router()

router.route('/').post(addOrder).get(protect,getAllOrders)
router.route('/user/:id').get(protect,getOrderByUserId)
router.route('/delete/:id').delete(protect,protectAdmin, deleteOrder)
router.route('/:id').get(protect,getOrderById)

module.exports=router