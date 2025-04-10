const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employee.controller');

router.get('/employees', employeeController.getEmployees); // Get all employees
router.get('/employees/:id', employeeController.getEmployeeById); // Get a single employee by ID
router.get('/employees/employeeId/:employeeId', employeeController.getEmployeeByEmployeeId); // Get employee by employeeId

module.exports = router;