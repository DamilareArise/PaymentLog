const express = require('express')
const paymentModel = require('../models/payment.models')
const PDFDocument = require('pdfkit')

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

const exportPDF = async (req, res) => {
    const { schoolType, type } = req.query;
    try {
        const payments = await paymentModel.find({ schoolType, type }).sort({ date: 1 });
        const totalAmount = payments.reduce((sum, p) => sum + p.amount, 0);

        const doc = new PDFDocument({ margin: 40, size: 'A4' });

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader(
            'Content-Disposition',
            `attachment; filename="${schoolType}-${type}-payments.pdf"`
        );
        doc.pipe(res);

        // Title
        doc.fontSize(18).font('Helvetica-Bold')
            .text(`${schoolType} School — ${type} Log`, { align: 'center' });
        doc.moveDown(0.5);
        doc.fontSize(10).font('Helvetica')
            .text(`Generated: ${new Date().toLocaleDateString('en-GB', { dateStyle: 'full' })}`, { align: 'center' });
        doc.moveDown(1);

        // Table header
        const tableTop = doc.y;
        const colX = { sn: 40, payer: 80, amount: 300, payId: 400, date: 460 };

        doc.fontSize(10).font('Helvetica-Bold');
        doc.text('S/N', colX.sn, tableTop);
        doc.text(type === 'Income' ? "Payer's Name" : 'Title', colX.payer, tableTop);
        doc.text('Amount (₦)', colX.amount, tableTop);
        doc.text('Pay ID', colX.payId, tableTop);
        doc.text('Date', colX.date, tableTop);

        doc.moveTo(40, tableTop + 15).lineTo(560, tableTop + 15).stroke();

        // Table rows
        doc.font('Helvetica').fontSize(9);
        let y = tableTop + 22;

        payments.forEach((p, i) => {
            if (y > 750) {
                doc.addPage();
                y = 40;
            }
            const rowColor = i % 2 === 0 ? '#FFFFFF' : '#F5F5F5';
            doc.rect(40, y - 4, 520, 18).fill(rowColor).stroke('#E0E0E0');
            doc.fillColor('#000000');

            doc.text(String(i + 1), colX.sn, y);
            doc.text(p.payer, colX.payer, y, { width: 210, ellipsis: true });
            doc.text(`#${p.amount.toLocaleString()}`, colX.amount, y);
            doc.text(`${p.schoolType}-00${p.payId}`, colX.payId, y);
            doc.text(new Date(p.date).toLocaleDateString('en-GB'), colX.date, y);

            y += 18;
        });

        // Total row
        doc.moveTo(40, y + 4).lineTo(560, y + 4).stroke();
        y += 10;
        doc.font('Helvetica-Bold').fontSize(10);
        doc.text('TOTAL', colX.payer, y);
        doc.text(`#${totalAmount.toLocaleString()}`, colX.amount, y);

        doc.end();
    } catch (err) {
        res.status(500).send({ status: false, message: 'Error generating PDF', error: err.message });
    }
};

module.exports = { logIncome, logExpense, allPayment, paymentByDate, deleteAllLog, exportPDF }