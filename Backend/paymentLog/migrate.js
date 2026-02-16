const mongoose = require('mongoose');
const paymentModel = require('./models/payment.models');
require('dotenv').config();

async function migrate() {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');
        
        const result = await paymentModel.updateMany(
            { $or: [{ type: { $exists: false } }, { type: null }] },
            { $set: { type: 'Income' } }
        );
        
        console.log(`Migration complete: ${result.matchedCount} documents matched, ${result.modifiedCount} documents modified.`);
    } catch (error) {
        console.error('Migration failed:', error);
    } finally {
        await mongoose.disconnect();
        process.exit();
    }
}

migrate();
