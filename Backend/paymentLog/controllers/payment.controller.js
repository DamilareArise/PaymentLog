const express = require('express')
const paymentModel = require('../models/payment.models')
const PDFDocument = require('pdfkit')

const logIncome = async (req, res) => {
    try {
        const { payer, amount, schoolType, purpose, class: studentClass, studentId } = req.body;

        const latestPayment = await paymentModel.findOne({
            schoolType,
            $or: [{ type: 'Income' }, { type: { $exists: false } }]
        }).sort({ date: -1 });

        const newPayId = latestPayment ? parseInt(latestPayment.payId) + 1 : 1;

        const today = new Date();
        const todayDate = today.toISOString().split('T')[0];

        let newSubtotal;
        if (latestPayment && latestPayment.date.toISOString().split('T')[0] === todayDate) {
            newSubtotal = latestPayment.subTotal + amount;
        } else {
            newSubtotal = amount;
        }

        const newPayment = new paymentModel({
            payId: newPayId,
            payer,
            amount,
            subTotal: newSubtotal,
            schoolType,
            type: 'Income',
            purpose: purpose || '',
            class: studentClass || '',
            studentId: studentId || null,
        });

        const data = await newPayment.save();
        res.send({ status: true, message: 'Payment logged successfully', data });
    } catch (err) {
        res.status(500).send({ status: false, message: 'Error logging payment', error: err.message });
    }
};

const logExpense = async (req, res) => {
    try {
        const { payer, amount, schoolType, purpose } = req.body;

        const latestExpense = await paymentModel.findOne({
            schoolType,
            type: 'Expense'
        }).sort({ date: -1 });

        const newPayId = latestExpense ? parseInt(latestExpense.payId) + 1 : 1;

        const today = new Date();
        const todayDate = today.toISOString().split('T')[0];

        let newSubtotal;
        if (latestExpense && latestExpense.date.toISOString().split('T')[0] === todayDate) {
            newSubtotal = latestExpense.subTotal + amount;
        } else {
            newSubtotal = amount;
        }

        const newExpense = new paymentModel({
            payId: newPayId,
            payer,
            amount,
            subTotal: newSubtotal,
            schoolType,
            type: 'Expense',
            purpose: purpose || '',
        });

        const data = await newExpense.save();
        res.send({ status: true, message: 'Expense logged successfully', data });
    } catch (err) {
        res.status(500).send({ status: false, message: 'Error logging expense', error: err.message });
    }
};

const paymentByDate = async (req, res) => {
    try {
        const { date, schoolType, type } = req.query;

        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);

        const records = await paymentModel.find({
            schoolType,
            type,
            date: { $gte: startOfDay, $lte: endOfDay },
        });

        res.send({ status: true, message: 'payment data fetched successfully', data: records });
    } catch {
        res.status(500).send({ status: false, message: 'Error fetching payment data' });
    }
};

const allPayment = async (req, res) => {
    const { schoolType, type, q, purpose, class: cls } = req.query;
    try {
        const query = { schoolType, type };
        if (q) query.payer = { $regex: q, $options: 'i' };
        if (purpose) query.purpose = purpose;
        if (cls) query['class'] = cls;
        const data = await paymentModel.find(query).sort({ date: 1 });
        res.send({ status: true, message: 'All payment data', data });
    } catch {
        res.status(500).send({ status: false, message: 'Error fetching payment data' });
    }
};

const deleteAllLog = async (req, res) => {
    const { schoolType, type } = req.query;
    try {
        await paymentModel.deleteMany({ schoolType, type });
        res.send({ status: true, message: 'All payment logs deleted successfully' });
    } catch (err) {
        res.status(500).send({ status: false, message: 'Error deleting payment logs', error: err.message });
    }
};

const exportPDF = async (req, res) => {
    const { schoolType, type, q, purpose, class: cls } = req.query;
    try {
        const query = { schoolType, type };
        if (q) query.payer = { $regex: q, $options: 'i' };
        if (purpose) query.purpose = purpose;
        if (cls) query['class'] = cls;

        const payments = await paymentModel.find(query).sort({ date: 1 });
        const totalAmount = payments.reduce((sum, p) => sum + p.amount, 0);

        // Landscape A4 so Purpose + Class fit comfortably
        const doc = new PDFDocument({ margin: 40, size: 'A4', layout: 'landscape' });

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader(
            'Content-Disposition',
            `attachment; filename="${schoolType}-${type}-payments.pdf"`
        );
        doc.pipe(res);

        // Title block
        doc.fontSize(16).font('Helvetica-Bold')
            .text(`${schoolType === 'SEC' ? 'Secondary' : 'Primary'} School — ${type} Log`, { align: 'center' });
        doc.moveDown(0.4);
        doc.fontSize(9).font('Helvetica')
            .text(`Generated: ${new Date().toLocaleDateString('en-GB', { dateStyle: 'full' })}`, { align: 'center' });
        if (q || purpose || cls) {
            const filters = [q && `Payer: "${q}"`, purpose && `Purpose: ${purpose}`, cls && `Class: ${cls}`].filter(Boolean).join(' · ');
            doc.fontSize(8).fillColor('#666666').text(`Filters — ${filters}`, { align: 'center' });
        }
        doc.moveDown(1);

        const tableTop = doc.y;
        const isIncome = type === 'Income';

        // Column x-positions depend on type
        const colX = isIncome
            ? { sn: 40, payer: 70, cls: 240, purpose: 315, amount: 430, payId: 520, date: 600 }
            : { sn: 40, payer: 70, amount: 380, payId: 470, date: 550 };

        doc.fontSize(9).font('Helvetica-Bold').fillColor('#000000');
        doc.text('S/N', colX.sn, tableTop);
        doc.text(isIncome ? "Payer's Name" : 'Title', colX.payer, tableTop);
        if (isIncome) {
            doc.text('Class', colX.cls, tableTop);
            doc.text('Purpose', colX.purpose, tableTop);
        }
        doc.text('Amount (₦)', colX.amount, tableTop);
        doc.text('Pay ID', colX.payId, tableTop);
        doc.text('Date', colX.date, tableTop);

        const lineEnd = isIncome ? 760 : 680;
        doc.moveTo(40, tableTop + 15).lineTo(lineEnd, tableTop + 15).stroke();

        doc.font('Helvetica').fontSize(8);
        let y = tableTop + 22;

        payments.forEach((p, i) => {
            if (y > 520) { doc.addPage(); y = 40; }
            const rowColor = i % 2 === 0 ? '#FFFFFF' : '#F5F7FF';
            doc.rect(40, y - 4, lineEnd - 40, 18).fill(rowColor).stroke('#E0E0E0');
            doc.fillColor('#000000');

            doc.text(String(i + 1), colX.sn, y);
            doc.text(p.payer || '', colX.payer, y, { width: 165, ellipsis: true });
            if (isIncome) {
                doc.text(p.class || '—', colX.cls, y, { width: 68 });
                doc.text(p.purpose || '—', colX.purpose, y, { width: 108, ellipsis: true });
            }
            doc.text(`₦${p.amount.toLocaleString()}`, colX.amount, y);
            doc.text(`${p.schoolType}-00${p.payId}`, colX.payId, y);
            doc.text(new Date(p.date).toLocaleDateString('en-GB'), colX.date, y);

            y += 18;
        });

        // Total row
        doc.moveTo(40, y + 4).lineTo(lineEnd, y + 4).stroke();
        y += 10;
        doc.font('Helvetica-Bold').fontSize(10);
        doc.text('TOTAL', colX.payer, y);
        doc.text(`₦${totalAmount.toLocaleString()}`, colX.amount, y);

        doc.end();
    } catch (err) {
        res.status(500).send({ status: false, message: 'Error generating PDF', error: err.message });
    }
};

module.exports = { logIncome, logExpense, allPayment, paymentByDate, deleteAllLog, exportPDF }
