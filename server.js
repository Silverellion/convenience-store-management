require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();

const signinRoutes = require('./routes/signin.route');
const accountRoutes = require('./routes/account.route');
const homeRoutes = require('./routes/home.route');
const productRoutes = require('./routes/product.route');
const orderRoutes = require('./routes/order.routes');
const employeeRoutes = require('./routes/employee.route');

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {})
.then(() => {
    console.log("MongoDB connected");
}).catch(err => {
    console.error("MongoDB connection error:", err);
});

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));

// Default route for login page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'html', 'login.html'));
});

app.use(signinRoutes); // Handles /signin
app.use(homeRoutes); // Handles /home
app.use('/api', accountRoutes); // Handles /api/accounts
app.use('/api', productRoutes); // Handles /api/products
app.use('/api', orderRoutes); // Handles /api/orders
app.use('/api', employeeRoutes); // Handles /api/employees

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running: http://localhost:${PORT}`);
});