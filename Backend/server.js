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
const couponRoutes = require('./routes/couponRoutes');
const wishlistRoutes = require('./routes/wishlistRoutes');
const passwordRoutes = require('./routes/passwordRoutes');

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
app.use('/api/coupons', couponRoutes);
app.use('/api/wishlist', wishlistRoutes);
app.use('/api/auth', passwordRoutes);

// SPA fallback — serve index.html for any non-file, non-API route
app.get('*', (req, res) => {
    if (req.path.startsWith('/api')) return res.status(404).json({ msg: 'Not found' });
    res.sendFile(path.join(__dirname, '../Frontend/index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`🚀 Hanuman Sports Server running on http://localhost:${PORT}`);
});