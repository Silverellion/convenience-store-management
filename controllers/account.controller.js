const Account = require('../models/account.model');

// Create an account
exports.createAccount = async (req, res) => {
    console.log("Request body:", req.body);
    const { username, password, employeeId, role } = req.body;

    if (!username || !password || !employeeId || !role) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    try {
        const newAccount = new Account({
            username,
            password,
            employeeId,
            role,
        });

        const savedAccount = await newAccount.save();

        res.status(201).json({
            message: 'Account created successfully.',
            account: savedAccount,
        });
    } catch (error) {
        console.error('Error creating account:', error);
        res.status(500).json({ message: 'An error occurred while creating the account.' });
    }
};

// Get all accounts
exports.getAccounts = async (req, res) => {
    try {
        const accounts = await Account.find();
        res.status(200).json(accounts);
    } catch (error) {
        console.error('Error fetching accounts:', error);
        res.status(500).json({ message: 'An error occurred while fetching accounts.' });
    }
};

// Get a single account by ID
exports.getAccountById = async (req, res) => {
    try {
        const account = await Account.findById(req.params.id);
        if (!account) {
            return res.status(404).json({ message: 'Account not found.' });
        }
        res.status(200).json(account);
    } catch (error) {
        console.error('Error fetching account:', error);
        res.status(500).json({ message: 'An error occurred while fetching the account.' });
    }
};

// Update an account
exports.updateAccount = async (req, res) => {
    const { username, password, employeeId, role } = req.body;

    if (!username || !employeeId || !role) {
        return res.status(400).json({ message: 'Employee ID, Username, and Role are required.' });
    }

    try {
        const updatedAccount = await Account.findByIdAndUpdate(
            req.params.id,
            { username, password, employeeId, role },
            { new: true, runValidators: true }
        );

        if (!updatedAccount) {
            return res.status(404).json({ message: 'Account not found.' });
        }

        res.status(200).json({
            message: 'Account updated successfully.',
            account: updatedAccount,
        });
    } catch (error) {
        console.error('Error updating account:', error);
        res.status(500).json({ message: 'An error occurred while updating the account.' });
    }
};

// Delete an account
exports.deleteAccount = async (req, res) => {
    try {
        const deletedAccount = await Account.findByIdAndDelete(req.params.id);

        if (!deletedAccount) {
            return res.status(404).json({ message: 'Account not found.' });
        }

        res.status(200).json({ message: 'Account deleted successfully.' });
    } catch (error) {
        console.error('Error deleting account:', error);
        res.status(500).json({ message: 'An error occurred while deleting the account.' });
    }
};