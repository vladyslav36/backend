const mongoose = require('mongoose')


const CategorySchema = mongoose.Schema({
  name: String,
  slug:String,
  description: { type: String, default: '' },
  image:String,
  parentCategoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref:'Category'
  },
  parentCategory: { type: String, default: '' },
  
  level: { type: Number, default: 0 }
  
}, {
  timestamps:true
})

const Category = mongoose.model('Category', CategorySchema)

module.exports=Category