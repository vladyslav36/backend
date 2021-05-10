import express from 'express'
import { config } from 'dotenv'
import connectDb from './config/db.js'
import morgan from 'morgan'
import { notFound } from './config/middleware/notFound.js'
import { errorHandler } from './config/middleware/errorHandler.js'

config({ path: './config/.env' })
connectDb()

const app = express()

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'))
}

app.use(express.json())
app.get('/', (req, res) => {
  res.json({message:'Hello world'})
})

app.use(notFound)
app.use(errorHandler)
const PORT=process.env.PORT || 5000
app.listen(PORT, console.log(`Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`)
)