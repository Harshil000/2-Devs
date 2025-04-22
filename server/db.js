const mongoose = require("mongoose")
require('dotenv').config()

const dbConnection = mongoose.connect(process.env.MONGO_URI).then(()=> {
  console.log("Connected to DB")
})

module.exports = dbConnection
