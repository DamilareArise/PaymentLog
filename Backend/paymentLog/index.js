const express = require('express')
const mongoose = require("mongoose")
const cors = require("cors")
const paymentRoute = require('./routes/payment.route')
require('dotenv').config()

const app = express()
const port = 3000

app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.use(cors())

app.use('/pay', paymentRoute)

let URI = process.env.MONGODB_URI
mongoose.connect(URI)
.then(()=>{
    console.log('mongoDB connected')
})
.catch((err)=>{
    console.log('mongoDB connection failed: ', err)
})

app.listen(port, (err)=>{
    if(err){
        console.log('error running server');
        
    }else{
        console.log('server running on port', port);
    }
})

