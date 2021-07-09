const mongoose = require("mongoose")

const BrandSchema = mongoose.Schema(
  {
    name: String,
    slug: String,
    image: String,
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
  },
  {
    timestamps: true,
  }
)

const Brand = mongoose.model("Brand", BrandSchema)

module.exports = Brand
