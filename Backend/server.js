const express = require('express');
const cors = require('cors');
const path = require('path');
const { connectDB } = require('./config/db');
require('dotenv').config({ path: __dirname + '/.env' });

const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const userRoutes = require('./routes/userRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');
const adminRoutes = require('./routes/adminRoutes');
const otpRoutes = require('./routes/otpRoutes');

const app = express();

// Middleware
app.use(cors({
    origin: true,
    credentials: true
}));
app.use(express.json());

// Connect to Database & Sync Tables (server keeps running if DB is down)
connectDB();

// Serve uploaded images to frontend
app.use('/uploads', express.static('uploads'));

// Serve static frontend files (always — works for both dev and production)
app.use(express.static(path.join(__dirname, '../Frontend')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/otp', otpRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Hanuman Sports Server running on http://localhost:${PORT}`);
});