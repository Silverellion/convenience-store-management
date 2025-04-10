const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({
    employeeId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    position: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    startDate: { type: String, required: true },
    status: { type: String, required: true, enum: ['Active', 'Inactive', 'On Leave'], default: 'Active' }
  });
  
module.exports = mongoose.model('Employee', employeeSchema, 'NhanVien');
