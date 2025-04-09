const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Products',  // Tên model export từ products
    required: true
  },
  quantity: { type: Number, required: true },
  totalPrice: { type: Number, required: true }
}, { _id: false });

const orderSchema = new mongoose.Schema({
  invoiceCode: { type: String, required: true, unique: true },
  createdAt: { type: Date, required: true },
  employeeId: { type: String, required: true },
  employeeName: { type: String, required: true },
  items: [itemSchema],
  totalAmount: { type: Number, required: true },
  paymentMethod: { type: String, required: true },
  customerPaid: { type: Number, required: true },
  change: { type: Number, required: true }
});

module.exports = mongoose.model('Orders', orderSchema, 'HoaDon');
