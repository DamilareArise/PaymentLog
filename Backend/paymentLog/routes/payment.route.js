const express = require('express')
const { logPayment, allPayment, paymentByDate, deleteAllLog } = require('../controllers/payment.controller')
const router = express.Router()


router.post('/log-payment', logPayment)
router.get('/all-payment', allPayment)
router.get('/payment-by-date', paymentByDate)
router.delete('/delete-all-log', deleteAllLog)

module.exports = router