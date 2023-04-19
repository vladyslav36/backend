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
    // brand: String,
    brandId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      default: null,
    },
    images: [{ type: String }],
    imagesMd: [{ type: String }],
    imagesSm: [{ type: String }],
    // category: {
    //   type: String,
    // },
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
    options: {
      type: Object,
      default: {}
    },
    barcods: {
      type: Object,
      default: {}
    },
    barcode: {
      type: String,
      default:''
    }
  },
  {
    timestamps: true,
    minimize: false,
  }
)

const Product = mongoose.model("Product", ProductSchema)

module.exports = Product
