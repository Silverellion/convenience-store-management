const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
    productId: { type: String, required: true },
    productName: { type: String, required: true },
    quantity: { type: Number, required: true },
    unitPrice: { type: Number, required: true },
    totalPrice: { type: Number, required: true }
});

const invoiceSchema = new mongoose.Schema({
    invoiceCode: { type: String, required: true, unique: true },
    createdAt: { type: Date, required: true, default: Date.now },
    employeeId: { type: String, required: true },
    employeeName: { type: String, required: true },
    items: [itemSchema],
    totalAmount: { type: Number, required: true },
    paymentMethod: { type: String, required: true },
    customerPaid: { type: Number, required: true },
    change: { type: Number, required: true }
});

module.exports = mongoose.model('Invoice', invoiceSchema, 'HoaDon');