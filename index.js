
const path = require("path")
const express = require("express")
const cors = require("cors")
const dotenv = require("dotenv")
const connectDb = require("./config/db.js")
const morgan = require("morgan")
const { notFound } = require("./middleware/notFound.js")
const { errorHandler } = require("./middleware/errorHandler.js")
const productsRouter = require("./routes/products")
const categoriesRouter = require("./routes/categories")
const catalogsRouter=require('./routes/catalogs')
const currencyRateRouter = require("./routes/currencyRate")
const cartRouter = require("./routes/cart")
const userRouter = require("./routes/user")
const searchRouter = require("./routes/search")
// const optionsRouter=require('./routes/options')
const orderRouter = require("./routes/order")
const informationRouter = require("./routes/information")
const fileUpload = require("express-fileupload")
const { urlencoded } = require("express")

dotenv.config({ path: "./config/.env" })
process.env.ROOT_NAME = path.dirname(__filename)

connectDb()

const app = express()

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"))
}
app.use(cors())
app.use(express.json())
app.use(urlencoded({extended:false}))
app.use(fileUpload())
app.use("/upload", express.static(path.join(__dirname, "/upload")))
app.use("/api/user", userRouter)
app.use("/api/products", productsRouter)
app.use("/api/categories", categoriesRouter)
app.use("/api/cart", cartRouter)
app.use("/api/currencyrate", currencyRateRouter)
app.use("/api/search", searchRouter)
app.use("/api/order", orderRouter)
app.use("/api/information", informationRouter)
app.use('/api/catalogs',catalogsRouter)
app.use(notFound)
app.use(errorHandler)

const PORT = process.env.PORT || 5000
app.listen(
  PORT,()=>
  console.log(
    `Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`
  )
)
