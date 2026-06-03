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
const shopRoutes = require('./routes/shopRoutes');
const paymentRoutes = require('./routes/paymentRoutes');

const app = express();

// Middleware
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5500',
  'http://127.0.0.1:5500',
  'https://hanuman-sports.github.io',
  'https://hanuman-sports-api.onrender.com'
];
app.use(cors({
    origin: (origin, cb) => {
      if (!origin || allowedOrigins.some(o => origin.startsWith(o))) return cb(null, true);
      cb(new Error('Not allowed by CORS'));
    },
    credentials: true
}));

// Handle CORS errors gracefully
app.use((err, req, res, next) => {
    if (err.message === 'Not allowed by CORS') {
        return res.status(403).json({ message: 'Origin not allowed by CORS policy' });
    }
    next(err);
});
app.use(express.json());

// Warn at startup if critical env vars are missing
if (!process.env.JWT_SECRET) {
    console.error('⚠️  CRITICAL: JWT_SECRET environment variable is not set. Authentication will fail.');
}

// Connect to Database & Sync Tables (server keeps running if DB is down)
connectDB().catch(err => console.error('connectDB failed:', err));

// Serve uploaded images to frontend (only locally; on Render, /tmp files aren't served)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

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
app.use('/api/shop', shopRoutes);
app.use('/api/payment', paymentRoutes);

// SPA fallback — serve index.html for any non-file, non-API route
app.get('*', (req, res) => {
    if (req.path.startsWith('/api')) return res.status(404).json({ msg: 'Not found' });
    res.sendFile(path.join(__dirname, '../Frontend/index.html'));
});

// Export for Render serverless; only listen directly when running standalone
if (!process.env.RENDER) {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`🚀 Hanuman Sports Server running on http://localhost:${PORT}`);
    });
}

module.exports = app;