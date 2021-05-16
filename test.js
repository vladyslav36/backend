const mongoose=require('mongoose')
const Category = require('./models/categoryModel')
const dotenv=require('dotenv')
const connectDb = require('./config/db')

dotenv.config({ path: './config/.env' })
connectDb()

const getCategories = async () => {
  const categories = await Category.findOne()
  // const newCategories=await Category.findOneAndUpdate({name:['Ybrf']})
  console.log(categories)
}

getCategories()