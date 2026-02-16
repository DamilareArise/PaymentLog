const express = require('express')
const paymentModel = require('../models/payment.models')

const logIncome = async (req, res) => {
    try {
        const { payer, amount, schoolType } = req.body;

        // Find the most recent payment entry and calculate new payId and subtotal
        // Filter by type 'Income' or where type is not set (for legacy data)
        const latestPayment = await paymentModel.findOne({
            schoolType,
            $or: [{ type: 'Income' }, { type: { $exists: false } }]
        }).sort({ date: -1 });

        const newPayId = latestPayment ? parseInt(latestPayment.payId) + 1 : 1;


        // Get the current date in 'MM/DD/YYYY' format
        const today = new Date();
        const todayDate = today.toISOString().split('T')[0]; // 'YYYY-MM-DD'

        let newSubtotal;
        if (latestPayment && latestPayment.date.toISOString().split('T')[0] === todayDate) {
            // If the latest entry is from today, add to the subtotal
            newSubtotal = latestPayment.subTotal + amount;
        } else {
            // If no entries today, start a new subtotal with the current amount
            newSubtotal = amount;   
        }
        // Create a new payment entry
        const newPayment = new paymentModel({
            payId: newPayId,
            payer,
            amount,
            subTotal: newSubtotal,
            schoolType,
            type: 'Income'
        });

        // Save the new payment entry to the database
        const data = await newPayment.save();

        res.send({ status: true, message: 'Payment logged successfully', data });
    } catch (err) {
        res.status(500).send({ status: false, message: 'Error logging payment', error: err.message });
    }
};

const logExpense = async (req, res) => {
    try {
        const { payer, amount, schoolType } = req.body;

        // Find the most recent expense entry
        const latestExpense = await paymentModel.findOne({
            schoolType,
            type: 'Expense'
        }).sort({ date: -1 });

        const newPayId = latestExpense ? parseInt(latestExpense.payId) + 1 : 1;

        // Get the current date in 'MM/DD/YYYY' format
        const today = new Date();
        const todayDate = today.toISOString().split('T')[0]; // 'YYYY-MM-DD'

        let newSubtotal;
        if (latestExpense && latestExpense.date.toISOString().split('T')[0] === todayDate) {
            // If the latest entry is from today, add to the subtotal
            newSubtotal = latestExpense.subTotal + amount;
        } else {
            // If no entries today, start a new subtotal with the current amount
            newSubtotal = amount;   
        }

        // Create a new expense entry
        const newExpense = new paymentModel({
            payId: newPayId,
            payer,
            amount,
            subTotal: newSubtotal, // Running total for expenses
            schoolType,
            type: 'Expense'
        });

        const data = await newExpense.save();
        res.send({ status: true, message: 'Expense logged successfully', data });
    } catch (err) {
        res.status(500).send({ status: false, message: 'Error logging expense', error: err.message });
    }
};

const paymentByDate = async (req, res)=>{
    try{
        const { date, schoolType, type } = req.query

        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0); // Set time to 00:00:00.000

        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999); // Set time to 23:59:59.999
        
        const records = await paymentModel.find({
            schoolType,
            type,
            date: {
                $gte: startOfDay,
                $lte: endOfDay
               }
            });


        res.send({status:true,message:'payment data fetched successfully', data:records})
    }catch{
        res.status(500).send({status:false,message:'Error fetching payment data'})
    }
}

const allPayment = async (req, res)=>{
    const { schoolType, type } = req.query
    try{
        const data = await paymentModel.find({schoolType, type});
        res.send({status:true,message:'All payment data',data})
    }catch{
        res.status(500).send({status:false,message:'Error fetching payment data'})
    }

}

const deleteAllLog = async (req, res) => {
    const { schoolType, type } = req.query
    try {
        await paymentModel.deleteMany({schoolType, type});
        res.send({ status: true, message: 'All payment logs deleted successfully' });
    } 
    catch (err) {
        res.status(500).send({ status: false, message: 'Error deleting payment logs',error: err.message });
    }
}

module.exports = {logIncome, logExpense, allPayment, paymentByDate, deleteAllLog}