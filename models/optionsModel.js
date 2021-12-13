const mongoose=require('mongoose')

const optionsSchema =mongoose.Schema({
  name: String,
  brandId: {
    type: mongoose.Schema.Types.ObjectId,
    default: null,
    ref: 'Category'
  },
  options: {},
},
  {
    minimize: false,
  timestamps:true
  },
)


const Options = mongoose.model('Options', optionsSchema)
  
module.exports=Options