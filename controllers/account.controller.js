const Account = require('../models/account.model');
exports.createAccount = async (req, res) => {
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

        // Save the document to MongoDB
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