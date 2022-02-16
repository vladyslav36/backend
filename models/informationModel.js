const mongoose=require('mongoose')

const informationSchema = mongoose.Schema({
  aboutUs: { type: String, default: '' },
  conditions: String,
  productReturn: String,
  delivery: String,
  address: String,
  workingHours: String,
  
}, {
  timestamps: true,
  minimize:false
})

const Information=mongoose.model('Information',informationSchema)

module.exports=Information