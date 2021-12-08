const { addOrder,getOrderById,getAllOrders,getOrderByUserId, getOrderCount, deleteOrder } = require('../controllers/order')

const router = require('express').Router()

router.route('/').post(addOrder).get(getAllOrders)
router.route('/user/:id').get(getOrderByUserId)
router.route('/delete/:id').get(deleteOrder)
router.route('/count').get(getOrderCount)
router.route('/:id').get(getOrderById)

module.exports=router