const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employee.controller');

router.get('/employees', employeeController.getEmployees);
router.get('/employees/check/:employeeId', employeeController.checkEmployeeExists);

module.exports = router;