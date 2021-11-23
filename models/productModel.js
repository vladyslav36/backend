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
    
    images: [{ type: String }],
    imagesMd: [{ type: String }],
    imagesSm: [{ type: String }],
    category: {
      type: String,
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      default: null,
    },
    description: {
      type: String,
    },

    
    isInStock: {
      type: Boolean,
      default: true,
    },

    isShowcase: {
      type: Boolean,
      default: false,
    },
    price: {
      type: String,
      default: "",
    },
    retailPrice: {
      type: String,
      default: "",
    },
    currencyValue: {
      type: String,
      required: true,
      default: "UAH",
    },
    options: [{
      name: String,
      values: [{
        name: {
          type: String,
          default:''
        },
        price: {
          type: String,
          default:''
        }
      }],
      isChangePrice: {
        type: Boolean,
        default: false
      }
     }],      
    
  },
  {
    timestamps: true,
  }
)

const Product = mongoose.model("Product", ProductSchema)

module.exports = Product
