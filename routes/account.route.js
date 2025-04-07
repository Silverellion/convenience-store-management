const express = require('express');
const router = express.Router();
const accountController = require('../controllers/account.controller');

router.post('/accounts', accountController.createAccount); // Create an account
router.get('/accounts', accountController.getAccounts); // Get all accounts
router.get('/accounts/:id', accountController.getAccountById); // Get a single account by ID
router.put('/accounts/:id', accountController.updateAccount); // Update an account
router.delete('/accounts/:id', accountController.deleteAccount); // Delete an account

module.exports = router;