const mongoose = require('mongoose')


const connectDB= async()=>{
    const con = await mongoose.connect(process.env.MONGO_URI)
    console.log(`mongo db connected  :  ${con.connection.host}`.cyan.underline.bold)
}

module.exports =connectDB