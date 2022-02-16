const express = require("express")
const router = express.Router()
const { protect, protectAdmin } = require("../middleware/auth")
const {
  addInformation,
  getInformation
} = require("../controllers/information")

router
  .route("/")
  .get(getInformation)
  .post(protect, protectAdmin, addInformation)

module.exports = router
