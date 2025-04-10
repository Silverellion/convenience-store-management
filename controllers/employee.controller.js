const Employee = require('../models/employee.model');

// Get all employees
exports.getEmployees = async (req, res) => {
    try {
        const employees = await Employee.find();
        res.status(200).json(employees);
    } catch (error) {
        console.error('Error fetching employees:', error);
        res.status(500).json({ message: 'An error occurred while fetching employees.' });
    }
};

// Check if employee exists by employeeId
exports.checkEmployeeExists = async (req, res) => {
    try {
        const { employeeId } = req.params;
        const employee = await Employee.findOne({ employeeId });
        
        if (employee) {
            return res.status(200).json({ exists: true, employee });
        } else {
            return res.status(404).json({ exists: false, message: 'Employee not found.' });
        }
    } catch (error) {
        console.error('Error checking employee:', error);
        res.status(500).json({ message: 'An error occurred while checking the employee.' });
    }
};