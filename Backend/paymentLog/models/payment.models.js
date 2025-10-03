const mongoose = require('mongoose')

const paymentSchema = mongoose.Schema({
    payId: {type:String},
    payer: {type:String, require:true},
    amount: {type:Number, require:true},
    subTotal: {type:Number, require:true},
    schoolType: {type:String, default:'SEC'},
    date: {type:Date, default:Date.now}
})

let paymentModel = mongoose.model('paymentlog', paymentSchema)

module.exports = paymentModel

