const Information = require("../models/informationModel")
const asyncHandler = require("express-async-handler")

exports.getInformation = asyncHandler(async (req, res, next) => {
  const information = await Information.findOne() || {}
  res.status(200).json({ information })
})

exports.addInformation = asyncHandler(async (req, res, next) => {
  const {aboutUs,
  conditions,
  productReturn,
  delivery,
  address,
  workingHours } = req.body 
  const information = await Information.findOne()
  if (information) {
    information.aboutUs= aboutUs,
    information.conditions=  conditions, 
    information.productReturn= productReturn, 
    information.delivery= delivery, 
    information.address=  address, 
    information.workingHours=  workingHours 
    await information.save()
  } else {
    await Information.create({
      aboutUs,
      conditions,
      productReturn,
      delivery,
      address,
      workingHours
    })
  }
  
  
  
  res.status(200).json({information})
})
