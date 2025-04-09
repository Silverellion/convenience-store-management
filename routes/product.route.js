const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');

router.get('/products', productController.getProducts); //lay danh sach
router.post('/products', productController.createProducts); //tao san pham
router.get('/products/:id', productController.getProductById);// lay mot san pham 
router.put('/products/:id', productController.updateProducts); //cap nhat san pham
router.delete('/products/:id', productController.deleteProducts); // xoa san pham

module.exports = router;