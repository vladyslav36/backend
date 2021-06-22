const mongoose = require("mongoose")

const BrandSchema = mongoose.Schema(
  {
    name: String,
    slug:String,
    image: String,
    colors: [String],
    sizes: [String],
    heights: [String],
  },
  {
    timestamps: true,
  }
)

const Brand = mongoose.model("Brand", BrandSchema)

module.exports = Brand
