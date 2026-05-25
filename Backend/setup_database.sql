-- ============================================
-- HANUMAN SPORTS DATABASE
-- Complete Schema with all Tables
-- ============================================

-- ============================================
-- 1. USERS TABLE
-- ============================================
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(15),
    role ENUM('user', 'admin') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 2. PRODUCTS TABLE (Main)
-- ============================================
CREATE TABLE products (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(200) NOT NULL,
    category VARCHAR(50) NOT NULL,
    sub_category VARCHAR(50),
    price DECIMAL(10,2) NOT NULL,
    original_price DECIMAL(10,2),
    discount_percent INT DEFAULT 0,
    stock INT DEFAULT 0,
    sku VARCHAR(50) UNIQUE,
    rating DECIMAL(2,1) DEFAULT 0,
    reviews_count INT DEFAULT 0,
    description TEXT,
    main_image TEXT,
    badge VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 3. PRODUCT IMAGES TABLE (Multiple images per product)
-- ============================================
CREATE TABLE product_images (
    id INT PRIMARY KEY AUTO_INCREMENT,
    product_id INT NOT NULL,
    image_url TEXT NOT NULL,
    is_primary BOOLEAN DEFAULT FALSE,
    display_order INT DEFAULT 0,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- ============================================
-- 4. CART TABLE
-- ============================================
CREATE TABLE cart (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT DEFAULT 1,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    UNIQUE KEY unique_cart (user_id, product_id)
);

-- ============================================
-- 5. ORDERS TABLE
-- ============================================
CREATE TABLE orders (
    id INT PRIMARY KEY AUTO_INCREMENT,
    order_number VARCHAR(50) UNIQUE NOT NULL,
    user_id INT NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    status ENUM('pending', 'processing', 'shipped', 'delivered', 'cancelled') DEFAULT 'pending',
    payment_method VARCHAR(50),
    shipping_address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- ============================================
-- 6. ORDER ITEMS TABLE
-- ============================================
CREATE TABLE order_items (
    id INT PRIMARY KEY AUTO_INCREMENT,
    order_id INT NOT NULL,
    product_id INT NOT NULL,
    product_name VARCHAR(200),
    quantity INT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id)
);

-- ============================================
-- 7. WISHLIST TABLE
-- ============================================
CREATE TABLE wishlist (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    UNIQUE KEY unique_wishlist (user_id, product_id)
);

-- ============================================
-- 8. REVIEWS TABLE
-- ============================================
CREATE TABLE reviews (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    rating INT CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
);

-- ============================================
-- 9. CATEGORIES TABLE (Optional - for better organization)
-- ============================================
CREATE TABLE categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL UNIQUE,
    icon VARCHAR(50),
    display_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 10. CONTACT / INQUIRIES TABLE
-- ============================================
CREATE TABLE contacts (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(15),
    subject VARCHAR(200),
    message TEXT NOT NULL,
    status ENUM('unread', 'read', 'replied') DEFAULT 'unread',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- INDEXES for better performance
-- ============================================
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_price ON products(price);
CREATE INDEX idx_products_rating ON products(rating);
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_cart_user_id ON cart(user_id);
CREATE INDEX idx_wishlist_user_id ON wishlist(user_id);
CREATE INDEX idx_reviews_product_id ON reviews(product_id);

-- ============================================
-- INSERT SAMPLE CATEGORIES
-- ============================================
INSERT INTO categories (name, icon, display_order) VALUES
('Badminton', 'fas fa-table-tennis', 1),
('Cricket', 'fas fa-baseball-ball', 2),
('Balls', 'fas fa-basketball-ball', 3),
('Accessories', 'fas fa-shoe-prints', 4),
('Ball Badminton', 'fas fa-tennis-ball', 5);

-- ============================================
-- INSERT ADMIN USER (password: admin123)
-- ============================================
INSERT INTO users (name, email, password, phone, role) VALUES
('Admin', 'admin@hanumansports.com', '$2a$10$N9qo8uLOickgx2ZMRZoMy.MrqPbLq7XqX5qX5qX5qX5qX5qX5qX5.', '9538452672', 'admin');

-- ============================================
-- INSERT SAMPLE PRODUCTS - BADMINTON
-- ============================================
INSERT INTO products (name, category, sub_category, price, original_price, discount_percent, stock, sku, rating, reviews_count, description, main_image, badge) VALUES
('Yonex GR 303 Aluminium Blend Badminton Racquet', 'Badminton', 'racket', 700, 965, 27, 50, 'HS-BAD-001', 0, 0, 'Lightweight aluminium badminton racquet suitable for beginners. Durable and easy to handle.', 'https://images.unsplash.com/photo-1587280501635-a19de238a81e?w=400', 'New'),
('Yonex Astrox Attack 9 G4 Badminton Racquet', 'Badminton', 'racket', 1400, 2475, 43, 25, 'HS-BAD-002', 4.5, 179, 'Head-light badminton racquet designed for fast swings and control. Made with graphite material.', 'https://images.unsplash.com/photo-1516043827470-d52d5435a122?w=400', 'Best Seller'),
('Yonex Mavis 350 Nylon Shuttlecock (Green Cap)', 'Badminton', 'shuttlecock', 1100, 1650, 33, 200, 'HS-BAD-003', 4.0, 33000, 'High-quality nylon shuttlecock with stable flight and durability.', 'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?w=400', 'Sale'),
('Yonex Super Grap Badminton Grip (Cyan)', 'Badminton', 'grip', 130, 180, 28, 500, 'HS-BAD-004', 4.3, 63, 'Comfortable grip tape that provides excellent sweat absorption and control.', 'https://m.media-amazon.com/images/I/71y6j-Nm1jL._SL1500_.jpg', NULL);

-- ============================================
-- INSERT SAMPLE PRODUCTS - CRICKET
-- ============================================
INSERT INTO products (name, category, sub_category, price, original_price, discount_percent, stock, sku, rating, reviews_count, description, main_image, badge) VALUES
('SF True Test Leather Cricket Ball', 'Cricket', 'balls', 480, 550, 13, 68, 'HS-CRK-001', 4.5, 0, 'Alum tanned leather cricket ball. Perfect for club use and practice matches.', 'https://images.unsplash.com/photo-1614624532983-1fe21c1d1c41?w=400', 'Best Seller'),
('TON Max Power Kashmir Willow Bat', 'Cricket', 'bats', 2600, 3140, 17, 15, 'HS-CRK-002', 4.3, 0, 'Kashmir Willow cricket bat with excellent power and control. Includes protective cover.', 'https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=400', 'Sale'),
('Bodyfit Plastic Stumps', 'Cricket', 'accessories', 400, 500, 20, 100, 'HS-CRK-003', 4.2, 0, 'Durable plastic stumps for practice and casual matches.', 'https://sl.bing.net/JCFuxWFaY8', 'Sale');

-- ============================================
-- INSERT SAMPLE PRODUCTS - BALLS
-- ============================================
INSERT INTO products (name, category, sub_category, price, original_price, discount_percent, stock, sku, rating, reviews_count, description, main_image, badge) VALUES
('Nivia SpotVolley Volleyball', 'Balls', 'volleyball', 1300, 1580, 18, 100, 'HS-BAL-VB01', 4.5, 0, 'High-quality Nivia SpotVolley volleyball perfect for professional and recreational play.', 'https://images.unsplash.com/photo-1592656094267-764a60323e4c?w=400', NULL),
('Cosco Super Volleyball', 'Balls', 'volleyball', 1350, 1680, 20, 80, 'HS-BAL-VB02', 4.7, 0, 'Cosco Super Volleyball with superior bounce and durability.', 'https://5.imimg.com/data5/SELLER/Default/2024/12/477266491/NY/YQ/GB/237351543/cosco-super-volleyball-1000x1000.jpg', NULL),
('Nivia Engraver Basketball', 'Balls', 'basketball', 870, 1019, 15, 120, 'HS-BAL-BB01', 4.6, 0, 'Nivia Engraver Basketball with excellent grip and control.', 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400', NULL);

-- ============================================
-- INSERT SAMPLE PRODUCTS - ACCESSORIES
-- ============================================
INSERT INTO products (name, category, sub_category, price, original_price, discount_percent, stock, sku, rating, reviews_count, description, main_image, badge) VALUES
('Tynor Knee Cap Air', 'Accessories', 'Knee Support', 180, 205, 12, 100, 'HS-ACC-001', 0, 0, 'Compression knee sleeve that supports muscles and improves performance.', 'https://example.com/knee_cap_air.jpg', 'Sale'),
('Tynor UV Protection Arm Sleeve', 'Accessories', 'Arm Sleeve', 450, 512, 12, 150, 'HS-ACC-002', 0, 0, 'Arm sleeve with UV protection to protect skin from sunlight.', 'https://example.com/arm_sleeve.jpg', NULL);

-- ============================================
-- INSERT SAMPLE PRODUCTS - BALL BADMINTON
-- ============================================
INSERT INTO products (name, category, sub_category, price, original_price, discount_percent, stock, sku, rating, reviews_count, description, main_image, badge) VALUES
('Professional Ball Badminton Racket', 'Ball Badminton', 'rackets', 1499, 2299, 35, 80, 'HS-BB-001', 4.5, 128, 'Professional ball badminton racket with carbon fiber frame.', 'https://m.media-amazon.com/images/I/71wQp6K1BcL._SL1500_.jpg', 'Best Seller'),
('Tournament Grade Balls', 'Ball Badminton', 'balls', 599, 899, 33, 300, 'HS-BB-002', 5.0, 95, 'Premium quality ball badminton balls for tournament play.', 'https://m.media-amazon.com/images/I/61Q8hq5qZzL._SL1500_.jpg', 'New'),
('Beginner Racket Set', 'Ball Badminton', 'rackets', 2299, 3499, 34, 50, 'HS-BB-003', 4.0, 64, 'Complete beginner racket set with 2 rackets and 3 balls.', 'https://m.media-amazon.com/images/I/61Xr1P0zO8L._SL1500_.jpg', NULL),
('Professional Net Set', 'Ball Badminton', 'net', 3499, 4999, 30, 30, 'HS-BB-004', 4.5, 42, 'Professional grade net set with poles and net.', 'https://m.media-amazon.com/images/I/61h1jfUq9DL._SL1500_.jpg', 'Sale');

-- ============================================
-- VIEWS for easy reporting
-- ============================================

-- View: Products with discount
CREATE VIEW vw_products_with_discount AS
SELECT id, name, category, sub_category, price, original_price, 
       discount_percent, stock, rating, created_at,
       (original_price - price) as saved_amount
FROM products 
WHERE discount_percent > 0;

-- View: Low stock products (less than 10)
CREATE VIEW vw_low_stock_products AS
SELECT id, name, category, stock, sku
FROM products 
WHERE stock < 10 
ORDER BY stock ASC;

-- View: Top rated products
CREATE VIEW vw_top_rated_products AS
SELECT id, name, category, price, rating, reviews_count
FROM products 
WHERE rating >= 4.0 AND reviews_count > 0
ORDER BY rating DESC, reviews_count DESC
LIMIT 10;

-- ============================================
-- STORED PROCEDURE: Get products by category
-- ============================================
DELIMITER //
CREATE PROCEDURE GetProductsByCategory(IN cat_name VARCHAR(50))
BEGIN
    SELECT * FROM products WHERE category = cat_name ORDER BY price ASC;
END //
DELIMITER ;

-- ============================================
-- STORED PROCEDURE: Update product stock
-- ============================================
DELIMITER //
CREATE PROCEDURE UpdateProductStock(IN prod_id INT, IN new_stock INT)
BEGIN
    UPDATE products SET stock = new_stock WHERE id = prod_id;
    SELECT id, name, stock FROM products WHERE id = prod_id;
END //
DELIMITER ;

-- ============================================
-- TRIGGER: Auto-update discount_percent when price changes
-- ============================================
DELIMITER //
CREATE TRIGGER update_discount_percent 
BEFORE UPDATE ON products
FOR EACH ROW
BEGIN
    IF NEW.original_price > 0 AND NEW.original_price > NEW.price THEN
        SET NEW.discount_percent = ROUND(((NEW.original_price - NEW.price) / NEW.original_price) * 100);
    ELSE
        SET NEW.discount_percent = 0;
    END IF;
END //
DELIMITER ;

-- ============================================
-- VERIFICATION QUERIES
-- ============================================
SELECT '========== DATABASE SCHEMA COMPLETE ==========' as '';
SELECT TABLE_NAME, TABLE_TYPE 
FROM information_schema.TABLES 
WHERE TABLE_SCHEMA = 'hanuman_sports'
ORDER BY TABLE_NAME;

SELECT '========== TOTAL PRODUCTS ==========' as '';
SELECT COUNT(*) as total_products FROM products;

SELECT '========== PRODUCTS BY CATEGORY ==========' as '';
SELECT category, COUNT(*) as count FROM products GROUP BY category;