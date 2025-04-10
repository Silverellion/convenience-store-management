const express = require('express');
const router = express.Router();
const invoiceController = require('../controllers/invoice.controller');

router.get('/invoices/count', invoiceController.getInvoiceCount);
router.get('/invoices/total', invoiceController.getTotalSales);
router.get('/invoices/top-products', invoiceController.getTopProducts);

module.exports = router;