/**
 * HANUMAN SPORTS - Global utilities
 * API products, cart (hs_cart), toasts, and offline fallbacks
 */

const API_BASE_URL = window.location.origin.includes('localhost')
    ? 'http://localhost:3000/api'
    : '/api';

const CATEGORY_FALLBACKS = {
    Badminton: [
        { id: 101, name: 'Yonex GR 303 Aluminium Blend Badminton Racquet', category: 'Badminton', sub_category: 'racket', price: 700, original_price: 965, rating: 4.5, main_image: 'https://images.unsplash.com/photo-1587280501635-a19de238a81e?w=400', badge: 'New' },
        { id: 102, name: 'Yonex Astrox Attack 9 G4 Badminton Racquet', category: 'Badminton', sub_category: 'racket', price: 1400, original_price: 2475, rating: 4.5, main_image: 'https://images.unsplash.com/photo-1516043827470-d52d5435a122?w=400', badge: 'Best Seller' }
    ],
    Cricket: [
        { id: 201, name: 'SF True Test Leather Cricket Ball', category: 'Cricket', sub_category: 'balls', price: 480, original_price: 550, rating: 4.5, main_image: 'https://images.unsplash.com/photo-1614624532983-1fe21c1d1c41?w=400', badge: 'Best Seller' },
        { id: 202, name: 'TON Max Power Kashmir Willow Bat', category: 'Cricket', sub_category: 'bats', price: 2600, original_price: 3140, rating: 4.3, main_image: 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=400', badge: 'Sale' }
    ],
    Balls: [
        { id: 301, name: 'Nivia SpotVolley Volleyball', category: 'Balls', sub_category: 'volleyball', price: 1300, original_price: 1580, rating: 4.5, main_image: 'https://images.unsplash.com/photo-1592656094267-764a60323e4c?w=400', badge: null },
        { id: 302, name: 'Cosco Super Volleyball', category: 'Balls', sub_category: 'volleyball', price: 1350, original_price: 1680, rating: 4.7, main_image: 'https://images.unsplash.com/photo-1592656094267-764a60323e4c?w=400', badge: null }
    ],
    Accessories: [
        { id: 401, name: 'Tynor Knee Cap Air', category: 'Accessories', sub_category: 'Knee Support', price: 180, original_price: 205, rating: 4.4, main_image: 'logo.png', badge: 'Sale' },
        { id: 402, name: 'Tynor UV Protection Arm Sleeve', category: 'Accessories', sub_category: 'Arm Sleeve', price: 450, original_price: 512, rating: 4.2, main_image: 'logo.png', badge: null }
    ],
    'Ball Badminton': [
        { id: 501, name: 'Professional Ball Badminton Racket', category: 'Ball Badminton', sub_category: 'rackets', price: 1499, original_price: 2299, rating: 4.5, main_image: 'logo.png', badge: 'Best Seller' },
        { id: 502, name: 'Tournament Grade Balls', category: 'Ball Badminton', sub_category: 'balls', price: 599, original_price: 899, rating: 5, main_image: 'logo.png', badge: 'New' }
    ]
};

function normalizeProduct(product) {
    const image = product.main_image || product.image || 'logo.png';
    return {
        ...product,
        image,
        main_image: image,
        price: parseFloat(product.price) || 0,
        original_price: product.original_price != null ? parseFloat(product.original_price) : null,
        rating: parseFloat(product.rating) || 4.5
    };
}

function extractProducts(payload) {
    if (!payload) return [];
    if (Array.isArray(payload)) return payload.map(normalizeProduct);
    if (Array.isArray(payload.products)) return payload.products.map(normalizeProduct);
    return [];
}

function getFallbackProducts(category) {
    if (!category) {
        return Object.values(CATEGORY_FALLBACKS).flat().map(normalizeProduct);
    }
    return (CATEGORY_FALLBACKS[category] || []).map(normalizeProduct);
}

async function getProducts(category = '') {
    try {
        const url = category
            ? `${API_BASE_URL}/products?category=${encodeURIComponent(category)}`
            : `${API_BASE_URL}/products`;

        const response = await fetch(url);
        if (!response.ok) throw new Error(`API ${response.status}`);

        const data = await response.json();
        const products = extractProducts(data);
        if (products.length > 0) return products;

        const fallback = getFallbackProducts(category);
        if (fallback.length > 0) {
            console.warn('Using catalog fallback for category:', category || 'all');
        }
        return fallback;
    } catch (error) {
        console.error('Database connection error:', error);
        return getFallbackProducts(category);
    }
}

function migrateLegacyCart() {
    try {
        const legacyRaw = localStorage.getItem('cart');
        if (!legacyRaw) return;

        const legacyCart = JSON.parse(legacyRaw);
        if (!Array.isArray(legacyCart) || legacyCart.length === 0) {
            localStorage.removeItem('cart');
            return;
        }

        let hsCart = [];
        try {
            hsCart = JSON.parse(localStorage.getItem('hs_cart') || '[]');
        } catch {
            hsCart = [];
        }

        if (!Array.isArray(hsCart) || hsCart.length === 0) {
            localStorage.setItem('hs_cart', JSON.stringify(legacyCart));
        }
        localStorage.removeItem('cart');
    } catch (err) {
        console.warn('Cart migration skipped:', err);
    }
}

let cart = [];

function loadCartFromStorage() {
    migrateLegacyCart();
    try {
        cart = JSON.parse(localStorage.getItem('hs_cart') || '[]');
    } catch {
        cart = [];
    }
    if (!Array.isArray(cart)) cart = [];
}

function addToCart(productId, name, price, image) {
    loadCartFromStorage();
    const id = typeof productId === 'string' && /^\d+$/.test(productId)
        ? parseInt(productId, 10)
        : productId;
    const existing = cart.find((item) => String(item.id) === String(id));
    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({
            id,
            name,
            price: parseFloat(price) || 0,
            image: image || 'logo.png',
            quantity: 1
        });
    }
    saveCart();
    showToast('success', 'Added to Cart!', `${name} has been added safely.`);
}

function saveCart() {
    localStorage.setItem('hs_cart', JSON.stringify(cart));
    const total = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);
    document.querySelectorAll('.cart-count').forEach((el) => {
        el.textContent = total;
    });
}

function showToast(type, title, message) {
    let container = document.getElementById('hs-toast-container') || createToastContainer();
    const toast = document.createElement('div');
    toast.className = `hs-toast hs-toast-${type}`;
    toast.style.cssText = `
        background: #0A0E17;
        border-left: 4px solid #00F0FF;
        color: #fff;
        padding: 12px 20px;
        margin-top: 10px;
        border-radius: 4px;
        box-shadow: 0 4px 12px rgba(0,240,255,0.2);
        font-family: 'Poppins', sans-serif;
        min-width: 250px;
    `;
    toast.innerHTML = `<strong style="color:#00F0FF;">${title}</strong><p style="margin:5px 0 0 0; font-size:12px; color:#ccc;">${message}</p>`;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), 3500);
}

function createToastContainer() {
    const div = document.createElement('div');
    div.id = 'hs-toast-container';
    div.style.cssText = 'position:fixed; bottom:20px; right:20px; z-index:9999;';
    document.body.appendChild(div);
    return div;
}

window.showNotification = (message) => showToast('success', 'Notice', message);

window.HanumanSports = {
    API_BASE_URL,
    getProducts,
    getFallbackProducts,
    addToCart,
    saveCart,
    showToast,
    showNotification: window.showNotification,
    migrateLegacyCart
};

document.addEventListener('DOMContentLoaded', () => {
    loadCartFromStorage();
    saveCart();
});
