const path =require('path')
const express = require('express')
const cors=require('cors')
const dotenv=  require ('dotenv')
const connectDb =require ('./config/db.js')
const morgan= require ('morgan')
const { notFound } = require ('./config/middleware/notFound.js')
const { errorHandler } = require('./config/middleware/errorHandler.js')
const productsRouter = require('./routes/products')
const categoriesRouter = require('./routes/categories')
const currencyRateRouter = require('./routes/currencyRate')
const brandsRouter=require('./routes/brands')
const uploadRouter = require('./routes/upload')
const cartRouter=require('./routes/cart')




dotenv.config({ path: './config/.env' })
process.env.ROOT_NAME = path.dirname(__filename)

connectDb()

const app = express()


if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev')) 
}
app.use(cors())  
app.use(express.json())
app.use('/upload',express.static(path.join(__dirname,'/upload')))

app.use('/api/products', productsRouter)
app.use('/api/categories', categoriesRouter)
app.use('/api/cart',cartRouter)
app.use('/api/currencyrate', currencyRateRouter)
app.use('/api/brands', brandsRouter)
app.use('/api/upload',uploadRouter)

app.use(notFound)
app.use(errorHandler)

const PORT=process.env.PORT || 5000
app.listen(PORT, console.log(`Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`)
)