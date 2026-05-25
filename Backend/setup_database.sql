-- ============================================================================
-- 1. CLEANUP PRE-EXISTING DUMMY RECORDS (Optional Safeguard)
-- ============================================================================
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE products;
SET FOREIGN_KEY_CHECKS = 1;

-- ============================================================================
-- 2. INSERT DUMMY PRODUCTS WITH BACKTICKED `desc` FIELD
-- ============================================================================

-- ----------------------------------------------------------------------------
-- CATEGORY: FOOTBALL
-- ----------------------------------------------------------------------------
INSERT INTO products (category, sub_category, name, `desc`, price, original_price, stock, rating, reviews_count, main_image, badge) VALUES
('Balls', 'Football', 'Hanuman Striker Pro Match Football', 'Thermo-bonded professional match ball with textured surface for optimal aerodynamic flight control.', 1499.00, 1999.00, 45, 4.8, 62, 'products/football_striker.png', 'Best Seller'),
('Balls', 'Football', 'CyberNeon Training Football', 'High-durability TPU casing with multi-layered canvas backing for regular pitch practice sessions.', 799.00, 999.00, 120, 4.3, 28, 'products/football_training.png', 'New'),
('Balls', 'Football', 'Vortex FIFA Quality Replica Ball', 'An exact specification design replica engineered for predictable rebound properties and low water absorption.', 2499.00, 2999.00, 20, 4.9, 15, 'products/football_vortex.png', 'Premium'),
('Balls', 'Football', 'Chrono Street Futsal Ball', 'Low-rebound size 4 football tailored specifically for hardcourt indoor futsal and street surfaces.', 899.00, 1199.00, 35, 4.5, 40, 'products/football_futsal.png', 'Trending'),
('Balls', 'Football', 'Titan Rubber Molded Football', 'Heavy-duty hard rubber ball designed to withstand rough gravel, concrete terrains, and extreme conditions.', 499.00, 599.00, 200, 4.1, 88, 'products/football_rubber.png', NULL);

-- ----------------------------------------------------------------------------
-- CATEGORY: BASKETBALL
-- ----------------------------------------------------------------------------
INSERT INTO products (category, sub_category, name, `desc`, price, original_price, stock, rating, reviews_count, main_image, badge) VALUES
('Balls', 'Basketball', 'Alpha Grip Composite Leather Basketball', 'Premium microfiber composite cover leather with deep channels for elite indoor competitive game control.', 2199.00, 2799.00, 30, 4.9, 53, 'products/bball_alpha.png', 'Top Pick'),
('Balls', 'Basketball', 'Quantum Neon Outdoor Basketball', 'Heavy-duty grained rubber surface offering exceptional responsiveness on rugged outdoor asphalt courts.', 699.00, 899.00, 85, 4.4, 72, 'products/bball_outdoor.png', NULL),
('Balls', 'Basketball', 'Hanuman Precision Official Game Ball', 'Size 7 professional basketball balancing structured structural carcass winding for consistent bounce cycles.', 3499.00, 3999.00, 15, 5.0, 11, 'products/bball_official.png', 'Premium'),
('Balls', 'Basketball', 'Apex Stealth Grip Ball', 'Moisture-wicking composite skin optimizes handling during highly intense, sweaty training drills.', 1599.00, 1999.00, 40, 4.6, 34, 'products/bball_stealth.png', '15% OFF'),
('Balls', 'Basketball', 'Nova Junior Size 5 Basketball', 'Lightweight youth basketball designed to help develop proper shooting form and finger positioning mechanics.', 549.00, 699.00, 60, 4.2, 19, 'products/bball_junior.png', 'Kids');

-- ----------------------------------------------------------------------------
-- CATEGORY: VOLLEYBALL
-- ----------------------------------------------------------------------------
INSERT INTO products (category, sub_category, name, `desc`, price, original_price, stock, rating, reviews_count, main_image, badge) VALUES
('Balls', 'Volleyball', 'Stratas Soft Touch Match Volleyball', '18-panel laminated microfiber design with advanced dimple aerodynamics for pinpoint setting accuracy.', 1299.00, 1699.00, 50, 4.7, 41, 'products/vball_stratas.png', 'Popular'),
('Balls', 'Volleyball', 'Hanuman Beach Cyber Cruiser', 'Waterproof stitched synthetic composite ball designed to withstand sand impact, wind drafts, and saltwater.', 849.00, 1099.00, 65, 4.5, 29, 'products/vball_beach.png', 'Trending'),
('Balls', 'Volleyball', 'Vigor Machine Stitched Training Ball', 'Soft foam padded backing structure reduces wrist sting for beginner setups and school environments.', 599.00, 799.00, 110, 4.3, 56, 'products/vball_training.png', NULL),
('Balls', 'Volleyball', 'Equinox Indoor Competition Volleyball', 'Meets structural VFI parameters for club matches. Exceptional shape retention under high impact velocity.', 1899.00, 2499.00, 18, 4.8, 14, 'products/vball_competition.png', 'Tournament'),
('Balls', 'Volleyball', 'Neon Flash High-Visibility Ball', 'Vibrant high-contrast dynamic panel patterns engineered to tracking rotation vectors in poor gymnasium lighting.', 749.00, 949.00, 40, 4.4, 22, 'products/vball_flash.png', 'New');

-- ----------------------------------------------------------------------------
-- CATEGORY: CRICKET
-- ----------------------------------------------------------------------------
INSERT INTO products (category, sub_category, name, `desc`, price, original_price, stock, rating, reviews_count, main_image, badge) VALUES
('Cricket', 'Bats', 'Hanuman Sudarshana English Willow Bat', 'Grade 1 selection English Willow featuring massive 40mm edges and an optimized mid-to-low sweet spot profile.', 14999.00, 18500.00, 8, 5.0, 31, 'products/cricket_bat_sudarshana.png', 'Handcrafted'),
('Cricket', 'Balls', 'Imperial Alum Tanned Leather Ball', 'Four-piece match leather ball bound with high-tensile internal cork cores for continuous 50-over shape profile retention.', 449.00, 599.00, 300, 4.6, 112, 'products/cricket_ball_leather.png', 'Bulk Available'),
('Cricket', 'Protective', 'Kalki Armour Pro Batting Pads', 'Ultra-lightweight high-density foam multi-section tibia protection incorporating deep gel knee cups.', 2499.00, 3200.00, 25, 4.8, 47, 'products/cricket_pads.png', 'Top Gear'),
('Cricket', 'Protective', 'Stealth Carbon Fiber Guard Helmet', 'High-impact outer composite shell paired with a fully adjustable titanium grid visor for premium safety.', 3199.00, 3999.00, 14, 4.9, 23, 'products/cricket_helmet.png', 'Certified'),
('Cricket', 'Accessories', 'Titan 400 Heavy Duty Wheelie Kit Bag', 'Premium 1680D nylon construction with dedicated bat compartments and solid base tractor wheels.', 3899.00, 4999.00, 12, 4.7, 39, 'products/cricket_bag.png', 'Essential');

-- ----------------------------------------------------------------------------
-- CATEGORY: TENNIS
-- ----------------------------------------------------------------------------
INSERT INTO products (category, sub_category, name, `desc`, price, original_price, stock, rating, reviews_count, main_image, badge) VALUES
('Balls', 'Tennis', 'Chrono Tour Heavy Duty Tennis Balls (3-Can)', 'Premium woven felt pressure-sealed cores optimized for peak performance on abrasive hard courts.', 379.00, 499.00, 250, 4.7, 145, 'products/tennis_ball_can.png', 'Best Seller'),
('Balls', 'Tennis', 'Apex Aero Carbon Tennis Racket', '270g unstrung graphite layout distributing explosive swing momentum through structural torsional stabilization frames.', 5499.00, 6999.00, 15, 4.8, 26, 'products/tennis_racket.png', 'Hot Product'),
('Balls', 'Tennis', 'Court King Championship Clay Balls (4-Can)', 'Special moisture-resistant felt avoids capturing heavy clay particulate matter during baseline rallies.', 499.00, 650.00, 140, 4.5, 38, 'products/tennis_clay_can.png', NULL),
('Balls', 'Tennis', 'Hanuman HydroAbsorb Overgrip 5-Pack', 'Ultra-thin polyurethane surface micro-porosity structure ensuring reliable handling when hands sweat heavily.', 299.00, 399.00, 400, 4.4, 89, 'products/tennis_grip.png', 'Value Pack'),
('Balls', 'Tennis', 'Velocity Portable Court Net (6m)', 'Freestanding collapsible frame kit ideal for driveway setups and coaching training clinics.', 2799.00, 3499.00, 10, 4.3, 12, 'products/tennis_net.png', 'Coaching');

-- ----------------------------------------------------------------------------
-- CATEGORY: BADMINTON
-- ----------------------------------------------------------------------------
INSERT INTO products (category, sub_category, name, `desc`, price, original_price, stock, rating, reviews_count, main_image, badge) VALUES
('Badminton', 'Rackets', 'Hanuman Vayu Nanocarbon Racket', 'High-modulus carbon fiber isometric head profile generating supreme 30lbs string tension capacities.', 4299.00, 5499.00, 22, 4.9, 64, 'products/badminton_racket_vayu.png', 'Elite Carbon'),
('Badminton', 'Shuttles', 'AeroFlight 100 Premium Goose Feather Shuttles', 'Hand-sorted premium goose feather skirts coupled with natural Portuguese solid cork bases for accurate flight rotation arcs.', 1249.00, 1599.00, 80, 4.8, 93, 'products/badminton_shuttle_feather.png', 'Match Grade'),
('Badminton', 'Shuttles', 'CyberYellow Nylon Shuttlecocks (6-Pack)', 'Precision-molded synthetic skirt duplicating accurate aerodynamic trajectory patterns with high structural lifetime.', 449.00, 599.00, 180, 4.2, 104, 'products/badminton_shuttle_nylon.png', 'Durable'),
('Badminton', 'Strings', 'Titan BG-66 Ultimate Response String', '0.65mm ultra-thin high polymer nylon core delivers high hitting sound acoustics and explosive repulsion feedback.', 599.00, 750.00, 350, 4.7, 51, 'products/badminton_string.png', 'Trending'),
('Badminton', 'Accessories', 'Pro Cushion Thermal Racket Bag', 'Dual compartment thermal-lined interior protection shielding carbon composites from extreme heat warp fatigue.', 1899.00, 2499.00, 16, 4.6, 20, 'products/badminton_bag.png', 'New Insulation');

-- ----------------------------------------------------------------------------
-- CATEGORY: ACCESSORIES
-- ----------------------------------------------------------------------------
INSERT INTO products (category, sub_category, name, `desc`, price, original_price, stock, rating, reviews_count, main_image, badge) VALUES
('Accessories', 'Bags', 'Hanuman CyberPack Stealth Backpack', 'Ergonomic water-resistant digital commuting backpack complete with ventilation isolated base footwear pocket sections.', 2199.00, 2999.00, 40, 4.7, 58, 'products/acc_backpack.png', 'Trending'),
('Accessories', 'Fitness', 'Quantum Speed Digital Skipping Rope', 'Weighted steel core rotation axles utilizing automated precision LCD jumps counter systems.', 399.00, 599.00, 150, 4.4, 76, 'products/acc_rope.png', 'Best Selling'),
('Accessories', 'Hydration', 'HydroFlsh Double-Walled Vacuum Flask (1L)', 'Pro-grade 18/8 stainless steel structure preserving sub-zero liquid cooling states for up to 24 consecutive training hours.', 899.00, 1200.00, 95, 4.8, 42, 'products/acc_flask.png', 'Insulated'),
('Accessories', 'Medical', 'Kinesiology Elastic Performance Tape', 'Hypoallergenic dynamic compression cotton wraps reducing muscle strain while supporting joint range recovery mechanics.', 249.00, 399.00, 500, 4.5, 130, 'products/acc_tape.png', 'Support'),
('Accessories', 'Electronics', 'AeroPulse Bluetooth Sports Watch', 'Real-time blood oxygen levels monitoring and tailored optical pulse metric nodes tracking match output cycles.', 2999.00, 4500.00, 18, 4.2, 35, 'products/acc_watch.png', 'New Tech');

-- ============================================================================
-- 3. VALIDATION ASSURANCE SUMMARY TABLE
-- ============================================================================
SELECT category, sub_category, COUNT(*) as product_count, AVG(price) as average_price 
FROM products 
GROUP BY category, sub_category;