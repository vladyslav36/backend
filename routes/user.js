const express = require('express')
const { protect } = require('../middleware/auth')
const router = express.Router()
const { userAuth, getUserProfile,registerUser } = require('../controllers/user')

router.route('/').post(registerUser)
router.route('/login').post(userAuth)
router.route('/profile').get(protect, getUserProfile)

module.exports=router