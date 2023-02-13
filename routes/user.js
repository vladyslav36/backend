const express = require('express')
const { protect } = require('../middleware/auth')
const router = express.Router()
const { userAuth, getUserProfile,registerUser, updateUser, login } = require('../controllers/user')

router.route('/')
  // .post(registerUser)
  .put(protect, updateUser)
// router.route('/login').post(userAuth)
router.route('/login').post(login)
// router.route('/profile').get(protect, getUserProfile)

module.exports=router