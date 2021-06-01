const mongoose = require("mongoose")


const ProductSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    name: {
      type: String
      
    },
    slug:String,

    model: {
      type: String,
      required: true,
    },
    image: { type: String },
    addedImages: [{ type: String }],
    category: {
      type: String,
      required: true,
    },

    description: {
      type: String,
    },
    isShowcase: {
      type: Boolean,
      default: false,
    },
    price: {
      type: Number,
      required: true,
      default: 0,
    },
    retailPrice: {
      type: Number,
      required: true,
      default: 0,
    },
    currencyValue: {
      type: String,
      required: true,
      default: "UAH",
    },
    countInStock: {
      type: Number,
      required: true,
      default: 100,
    },
  },
  {
    timestamps: true,
  }
)

const Product = mongoose.model("Product", ProductSchema)

module.exports = Product
