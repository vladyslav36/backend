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
    productSlug: String,
    image: { type: String },
    addedImages: [{ type: String }],
    category: {
      type: String,
    },
    categorySlug: String,
    description: {
      type: String,
    },
    isShowcase: {
      type: Boolean,
      default: false,
    },
    price: {
      type: Number,
      default: 0,
    },
    retailPrice: {
      type: Number,
      default: 0,
    },
    currencyValue: {
      type: String,
      required: true,
      default: "UAH",
    },
    countInStock: {
      type: Number,
      default: 100,
    },
  },
  {
    timestamps: true,
  }
)

const Product = mongoose.model("Product", ProductSchema)

module.exports = Product
