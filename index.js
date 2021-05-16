const express=require('express') 
const cors=require('cors')
const dotenv=  require ('dotenv')
const connectDb =require ('./config/db.js')
const morgan= require ('morgan')
const { notFound } = require ('./config/middleware/notFound.js')
const { errorHandler } = require('./config/middleware/errorHandler.js')
const productsRouter = require('./routes/products')
const categoriesRouter = require('./routes/categories')
const currencyRateRouter=require('./routes/currencyRate')

dotenv.config({ path: './config/.env' })
connectDb()

const app = express()

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}
app.use(cors()) 
app.use(express.json())
app.use(express.static('upload'))

app.use('/api/products', productsRouter)
app.use('/api/categories',categoriesRouter)
app.use('/api/currencyrate',currencyRateRouter)

app.use(notFound)
app.use(errorHandler)

const PORT=process.env.PORT || 5000
app.listen(PORT, console.log(`Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`)
)