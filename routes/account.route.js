const express = require('express');
const router = express.Router();
const accountController = require('../controllers/account.controller');

router.post('/accounts', accountController.createAccount);

module.exports = router;
console.log("Account routes loaded");