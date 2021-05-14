const express=require('express') 
const path = require('path')
const cors=require('cors')

const dotenv=  require ('dotenv')
const connectDb =require ('./config/db.js')
const morgan= require ('morgan')
const { notFound } = require ('./config/middleware/notFound.js')
const { errorHandler } = require('./config/middleware/errorHandler.js')
const Product=require('./models/productModel')
const Category = require('./models/categoryModel')



dotenv.config({ path: './config/.env' })
connectDb()

const app = express()

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}
app.use(cors()) 
app.use(express.json())
app.use(express.static('upload'))

app.get('/api/showcase', async (req, res) => {
  const showcaseProducts = await Product.find({ isShowcase: true })  
  res.status(200).json( showcaseProducts)
  
})
app.get('/api/category', async (req, res) => {
  const pp = await Category.findOne({ name: 'Ника' })
  const id=pp._id
  await Category.findOneAndUpdate({ name: "Колготки женские" },{parentCategory:id})
  const category1=await Category.findOne({name:'Колготки женские'})
  
  res.json(category1)
  })

app.use(notFound)
app.use(errorHandler)
const PORT=process.env.PORT || 5000
app.listen(PORT, console.log(`Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`)
)