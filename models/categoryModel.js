const mongoose = require('mongoose')



const CategorySchema = mongoose.Schema({
  name: String,
  slug:String,
  description: { type: String, default: '' },
  image: String,
  options: {
    type: Object,
    default: {}
  },
  parentCategoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    default:null
  },
  brandId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    default:null
  },
  parentCategory: { type: String, default: '' },
  
  qntProducts:{type:Number,default:0},
  // level: { type: Number, default: 0 }
  
}, {
  minimize:false,
  timestamps:true
})


const Category = mongoose.model('Category', CategorySchema)

module.exports=Category