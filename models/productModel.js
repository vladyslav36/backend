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
    brand: String,
    brandId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Brand",
      default: null,
    },
    image: { type: String },
    addedImages: [{ type: String }],
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

    colors: [
      {
        name: String,
        price: String,
      },
    ],
    sizes: [
      {
        name: String,
        price: String,
      },
    ],
    heights: [
      {
        name: String,
        price: String,
      },
    ],
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
  },
  {
    timestamps: true,
  }
)

const Product = mongoose.model("Product", ProductSchema)

module.exports = Product
