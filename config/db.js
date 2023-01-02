const mongoose = require("mongoose")

const connectDb = async (req, res) => {
  try {
    mongoose.set( 'strictQuery', false)
    const conn = await mongoose.connect(process.env.MONGO_URI)
    console.log(`MongoDb connect ${conn.connection.host}`)
  } catch (err) {
    console.log(`Error ${err.message}`)
    process.exit(1)
  }
}

module.exports = connectDb
