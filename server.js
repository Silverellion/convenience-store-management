require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const app = express();
const accountRoutes = require('./routes/account.route');
const homeRoutes = require('./routes/home.route');

// Kết nối MongoDB Atlas
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

// Public static files (login.html, etc.)
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'html', 'login.html'));
});

// Routes
app.use(accountRoutes);
// app.use(homeRoutes);

// Server start
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Server running: http://localhost:${PORT}`);
});
