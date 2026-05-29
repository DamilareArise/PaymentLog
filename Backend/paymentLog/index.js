const express = require('express')
const mongoose = require("mongoose")
const cors = require("cors")
const paymentRoute = require('./routes/payment.route')
const authRoute = require('./routes/auth.route')
const studentRoute = require('./routes/student.route')
const staffRoute = require('./routes/staff.route')
const subjectRoute = require('./routes/subject.route')
const dashboardRoute = require('./routes/dashboard.route')
require('dotenv').config()

const app = express()
const port = process.env.PORT || 3000

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors())

app.use('/pay', paymentRoute)
app.use('/auth', authRoute)
app.use('/students', studentRoute)
app.use('/staff', staffRoute)
app.use('/subjects', subjectRoute)
app.use('/dashboard', dashboardRoute)

let URI = process.env.MONGODB_URI
mongoose.connect(URI)
  .then(() => console.log('mongoDB connected'))
  .catch((err) => console.log('mongoDB connection failed: ', err))

app.listen(port, (err) => {
  if (err) {
    console.log('error running server');
  } else {
    console.log('server running on port', port);
  }
})
