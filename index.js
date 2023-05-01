

const dotenv = require("dotenv")

const path = require("path")
const http = require('http')
const socketio=require('socket.io')
const express = require("express")
const cors = require("cors")
const connectDb = require("./config/db.js")
const morgan = require("morgan")
const { notFound } = require("./middleware/notFound.js")
const { errorHandler } = require("./middleware/errorHandler.js")
const productsRouter = require("./routes/products")
const categoriesRouter = require("./routes/categories")
const catalogsRouter=require('./routes/catalogs')
const currencyRateRouter = require("./routes/currencyRate")
const userRouter = require("./routes/user")
const searchRouter = require("./routes/search")
const orderRouter = require("./routes/order")
const informationRouter = require("./routes/information")
const barcodeRouter=require('./routes/barcode')
const fileUpload = require("express-fileupload")
const { urlencoded } = require("express")
const { tBotHandler, vBotHandler } = require("./bots")
const { cleanUpTempFolder } = require("./utils/cleanUpTempFolder.js")


dotenv.config({ path: "./config/.env" })
process.env.ROOT_NAME = path.dirname(__filename)



connectDb()


// Проверка и удаление старый файлов(больше недели) в папке temp. Раз в сутки
const intervalId = setInterval(() => {
  cleanUpTempFolder()
},24*3600*1000)

const app = express()

const server = http.createServer(app)
const io = socketio(server)

const tBot = tBotHandler(io)
const vBot = vBotHandler(io) 

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"))
}
app.use(cors())
app.use((req, res, next) => {
  req.tBot = tBot
  req.vBot = vBot
  next()
})

app.use(urlencoded({extended:false}))
app.use(fileUpload())
app.use("/upload",express.json(), express.static(path.join(__dirname, "/upload")))
app.use("/temp",express.json(), express.static(path.join(__dirname, "/temp")))
app.use("/api/user",express.json(), userRouter)
app.use("/api/products",express.json(), productsRouter)
app.use("/api/categories",express.json(), categoriesRouter)
app.use("/api/currencyrate",express.json(), currencyRateRouter)
app.use("/api/search",express.json(), searchRouter)
app.use("/api/order",express.json(), orderRouter)
app.use("/api/information",express.json(), informationRouter)
app.use('/api/catalogs', express.json(), catalogsRouter)
app.use('/api/barcode',express.json(),barcodeRouter)
app.use("/viber/webhook", vBot.middleware())
app.use(notFound)
app.use(errorHandler)

const PORT = process.env.PORT || 5000
server.listen(
  PORT,()=>
  console.log(
    `Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`
  )
)
