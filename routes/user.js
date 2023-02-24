const express = require('express')
const { protect,protectAdmin } = require('../middleware/auth')
const router = express.Router()
const { getUsers, updateUser, login } = require('../controllers/user')

router.route('/')
  .get(protect,protectAdmin,getUsers)
  .put(protect, updateUser)
  router.route('/status')
  
// router.route('/login').post(userAuth)
router.route('/login').post(login)
// router.route('/profile').get(protect, getUserProfile)

module.exports=router