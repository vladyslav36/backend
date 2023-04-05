const mongoose = require("mongoose")
const dotenv = require("dotenv")
const connectDb = require("./config/db")
const Product = require("./models/productModel")

dotenv.config({ path: "./config/.env" })
connectDb()

const migrateProducts = async () => {
  const products = await Product.find({})
  await Promise.all(
    products.map(async (product) => {
      const { options } = product
      // const newOptions = Object.assign(
      //   {},
      //   ...Object.keys(options).map((option) => {
      //     return {
      //       [option]: Object.assign({}, ...Object.keys(options[option].values)
      //         .filter((item) => options[option].values[item].checked)
      //         .map((value) => ({
      //           [value]: {
      //           price: options[option].values[value].price
      //             ? options[option].values[value].price
      //               : product.price,
      //             isChanged: options[option].values[value].price ? true : false,
      //             barcode:''
      //         }
               
      //         }))) 
      //     }
      //   })
      // )
      // --------------------------------------------------------------------------------
      const newOptions = Object.assign({}, ...Object.keys(options).map(option => {        
        return {
          [option]: Object.assign({}, ...Object.keys(options[option]).map(value => {
            const { barcode, ...newValue }=options[option][value]
            return {
              [value]:newValue
            }     
            
          }))
         
        }
      }))
// ---------------------------------------------------------------------------------------
      await Product.findOneAndUpdate({ _id: product._id },{options:newOptions})

    })
  )
 
  process.exit()
}

migrateProducts()
