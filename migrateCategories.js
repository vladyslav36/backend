const mongoose = require('mongoose')
const dotenv=require('dotenv')

const path = require('path')
const connectDb = require('./config/db')
const Category = require('./models/categoryModel')

dotenv.config({ path: './config/.env' })
connectDb()

const migrateCategory = async () => {
  const categories = await Category.find({})
 await Promise.all( categories.map(async category => {
    if (category.parent) return
    
    const newOptions = Object.assign({},...Object.keys(category.options).map(option => {
     return {[option]:Object.keys(category.options[option].values)}
   }))
    await Category.updateOne({ _id: category._id },{options:newOptions})
  }))
  process.exit()
}

migrateCategory()

