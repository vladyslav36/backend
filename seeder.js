const mongoose =require('mongoose') 
const Product =require('./models/productModel') 
const Order =require('./models/orderModel') 
const User = require('./models/userModel')
const Category = require('./models/categoryModel')
const CurrencyRate = require('./models/currencyRateModel')

const dotenv =require('dotenv') 
const products =require('./data/products') 
const users =require('./data/users') 
const categories =require('./data/categories') 
const currencyRate =require('./data/currencyRate') 
const connectDb =require('./config/db') 

dotenv.config({ path: "./config/.env" })
connectDb()

const importData = async () => {
  try {
    await Order.deleteMany()
    await Product.deleteMany()
    await User.deleteMany()
    await Category.deleteMany()
    await CurrencyRate.deleteMany()
    const createdUsers = await User.insertMany(users)
    
    const adminUser = createdUsers[0]._id
    
    const sampleProducts = products.map(product => ({...product,user:adminUser}))
    const sampleCategories = categories.map(category => ({...category,parentCategory:adminUser}))
    
    
    
    await Product.insertMany(sampleProducts)
    await Category.insertMany(sampleCategories)
    await CurrencyRate.insertMany(currencyRate)
    console.log('Data imported')
    process.exit()
  } catch (error) {
    console.log(error)
    process.exit(1)
  }
}
const destroyData = async () => {
  try {
    await Order.deleteMany()
    await Product.deleteMany()
    await User.deleteMany()
    await Category.deleteMany()
    await CurrencyRate.deleteMany()
    
    console.log('Data destroyed')
    process.exit()
  } catch (error) {
    console.log(error)
    process.exit(1)
  }
}

if (process.argv[2] === '-d') {
  destroyData()
} else {
  importData()
}


