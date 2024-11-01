const express = require('express')
const { logPayment, allPayment } = require('../controllers/payment.controller')
const router = express.Router()


router.post('/log-payment', logPayment)
router.get('/all-payment', allPayment)

module.exports = router