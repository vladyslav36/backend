const mongoose=require('mongoose')

const CatalogSchema = mongoose.Schema({
  name: String,  
  image:String,
  parentCatalogId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Catalog',
    default:null
  },
  qntProducts: {
    type: Number,
    default:0
  }
},
  {
    minimize: false,
    timestamps:true
  })

  module.exports=mongoose.model('Catalog',CatalogSchema)