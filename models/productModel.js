const mongoose = require("mongoose")

const ProductSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    name: {
      type: String,
      required: true,
    },
    slug: String,

    model: {
      type: String,
      required: true,
    },
    
    brandId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      default: null,
    },
    images: [{ type: String }],
    imagesMd: [{ type: String }],
    imagesSm: [{ type: String }],
    
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      default: null,
    },
    catalogId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Catalog',
      default:null,
    },
    description: {
      type: String,
    },

   
    isShowcase: {
      type: Boolean,
      default: false,
    },
  
    currencyValue: {
      type: String,
      required: true,
      default: "UAH",
    },
    options: {},
    ownOptions: {
      type: Object,
      default: {}
    },
    optionValues: {
      type: Object,
      default: {}
    },
   
  },
  {    
    minimize: false,
  }
)

const Product = mongoose.model("Product", ProductSchema)

module.exports = Product
