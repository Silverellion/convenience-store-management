const express = require('express');
const router = express.Router();
const accountController = require('../controllers/account.controller');
const path = require('path');

//hien thi trang login
router.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname,'..', 'public', 'html', 'login.html'));
});

// Xử lý POST từ form login.html
router.post('/login', accountController.login);

module.exports = router;
