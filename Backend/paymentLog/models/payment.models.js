const mongoose = require('mongoose')

const paymentSchema = mongoose.Schema({
    payId: {type:String},
    payer: {type:String, require:true},
    paymentInfo: {type:String, require:true},
    amount: {type:Number, require:true},
    subTotal: {type:Number, require:true},
    date: {type:Date, default:Date.now}
})

let paymentModel = mongoose.model('paymentlog', paymentSchema)

module.exports = paymentModel

