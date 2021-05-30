const mongoose = require('mongoose')
const slug = require('mongoose-slug-updater')

 mongoose.plugin(slug)

const CategorySchema = mongoose.Schema({
  name: String,
  slug:{type:String,slug:'name',unique:true}, 
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