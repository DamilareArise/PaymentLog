const express = require('express')
const { logPayment, allPayment, paymentByDate } = require('../controllers/payment.controller')
const router = express.Router()


router.post('/log-payment', logPayment)
router.get('/all-payment', allPayment)
router.get('/payment-by-date', paymentByDate)

module.exports = router