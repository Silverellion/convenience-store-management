const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');

router.get('/orders', orderController.getOrder); //lay danh sach hoa don
router.get('/orders/total', orderController.totalSale); //lay danh sach cac san pham da duoc ban ra
router.delete('/orders/:id', orderController.deleteOrder); // Xoa hoa don
router.get('/orders/revenue', orderController.getRevenueMonthly); //thong ke doanh thu theo thang
router.get('/orders/top-products', orderController.getTopProducts);
module.exports = router;