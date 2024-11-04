const express = require('express')
const paymentModel = require('../models/payment.models')

const logPayment = async (req, res) => {
    try {
        const { payer, amount } = req.body;

        // Find the most recent payment entry and calculate new payId and subtotal
        const latestPayment = await paymentModel.findOne().sort({ date: -1 });

        const newPayId = latestPayment ? parseInt(latestPayment.payId) + 1 : 1;
        const newSubtotal = (latestPayment ? latestPayment.subTotal : 0) + amount;

        // Create a new payment entry
        const newPayment = new paymentModel({
            payId: newPayId,
            payer,
            amount,
            subTotal: newSubtotal
        });

        // Save the new payment entry to the database
        const data = await newPayment.save();

        res.send({ status: true, message: 'Payment logged successfully', data });
    } catch (err) {
        res.status(500).send({ status: false, message: 'Error logging payment', error: err.message });
    }
};

const paymentByDate = async (req, res)=>{
    try{
        const { date } = req.query

        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0); // Set time to 00:00:00.000

        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999); // Set time to 23:59:59.999
        
        const records = await paymentModel.find({
            date: {
                $gte: startOfDay,
                $lte: endOfDay
               }
            });

        // record for the previous day
        const startOfPrevDay = new Date(startOfDay);
        startOfPrevDay.setDate(startOfPrevDay.getDate() - 1);
        
        const endOfPrevDay = new Date(startOfPrevDay);
        endOfPrevDay.setHours(23, 59, 59, 999); 

        const prevDayLastRecord = await paymentModel.find({
            date: {
                $gte: startOfPrevDay,
                $lte: endOfPrevDay
            }
        }).sort({ date: -1 }); // Get the latest entry of the previous day

        // Calculate the subtotal from the latest record on the previous day, or 0 if none exists
        const subtotal = prevDayLastRecord ? prevDayLastRecord.subTotal : 0;


        res.send({status:true,message:'payment data fetched successfully', data:records, prevDaySubtotal: subtotal})
    }catch{
        res.status(500).send({status:false,message:'Error fetching payment data'})
    }
}

const allPayment = async (req, res)=>{
    try{
        const data = await paymentModel.find();
        res.send({status:true,message:'All payment data',data})
    }catch{
        res.status(500).send({status:false,message:'Error fetching payment data'})
    }

}

module.exports = {logPayment, allPayment, paymentByDate}