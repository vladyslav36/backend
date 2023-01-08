const mongoose = require("mongoose")

const CategorySchema = mongoose.Schema(
  {
    name: String,
    slug: String,
    description: { type: String, default: "" },
    image: String,
    options: {
      type: Object,
      default: {},
    },
    parentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      default: null,
    },
    brandId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      default: null,
    },
    parent: { type: String, default: "" },

    qntProducts: { type: Number, default: 0 },
    // Каталог товаров этого бренда
    catalog: { type: String, default: '' },
    // Прайс товаров этого бренда
    price:{type:String,default:''}
    
  },
  
  {
    minimize: false,
    timestamps: true,
  }
)

const Category = mongoose.model("Category", CategorySchema)

module.exports = Category
