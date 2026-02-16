const express = require('express')
const { logIncome, logExpense, allPayment, paymentByDate, deleteAllLog } = require('../controllers/payment.controller')
const router = express.Router()


router.post('/log-payment', logIncome)
router.post('/log-expense', logExpense)
router.get('/all-payment', allPayment)
router.get('/payment-by-date', paymentByDate)
router.delete('/delete-all-log', deleteAllLog)

module.exports = router