const express = require('express');
const router = express.Router();
const accountController = require('../controllers/account.controller');

router.post('/accounts', accountController.createAccount);
router.get('/accounts', accountController.getAccounts);

module.exports = router;