require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();

const signinRoutes = require('./routes/signin.route');
const accountRoutes = require('./routes/account.route');
const homeRoutes = require('./routes/home.route');

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
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
app.use('/api', accountRoutes); // Handles /api/accounts
app.use(homeRoutes); // Handles /home

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server running: http://localhost:${PORT}`);
});