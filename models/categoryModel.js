const mongoose = require('mongoose')

const CategorySchema = mongoose.Schema({
  name: String,
  parentCategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref:'Category'
  },
  
  level: { type: Number, default: 0 }
  
}, {
  timestamps:true
})

const Category = mongoose.model('Category', CategorySchema)

module.exports=Category