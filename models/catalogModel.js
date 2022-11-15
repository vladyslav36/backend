const mongoose=require('mongoose')

const CatalogSchema = mongoose.Schema({
  name: String,
  slug: String,
  image: {
    type: String,
    default:''
  },
  parentCatalog: {
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