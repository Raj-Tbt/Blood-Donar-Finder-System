-- Blood Donor Finder System - Database Schema
-- MySQL 8.x
--
-- This schema defines the complete database structure including:
-- Tables, Triggers, Views, and Stored Procedures.

CREATE DATABASE IF NOT EXISTS blood_donor_db;
USE blood_donor_db;

-- Users table (donors, hospitals, admins)
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    role ENUM('donor', 'hospital', 'admin') NOT NULL DEFAULT 'donor',
    city VARCHAR(100),
    pincode VARCHAR(10),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    avatar_url VARCHAR(255) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_city (city),
    INDEX idx_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Donors table (extends users for donor-specific data)
CREATE TABLE IF NOT EXISTS donors (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL UNIQUE,
    blood_group ENUM('A+','A-','B+','B-','O+','O-','AB+','AB-') NOT NULL,
    last_donated_date DATE DEFAULT NULL,
    is_available BOOLEAN DEFAULT TRUE,
    total_donations INT DEFAULT 0,
    weight_kg FLOAT DEFAULT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_blood_group (blood_group),
    INDEX idx_is_available (is_available),
    INDEX idx_bg_city (blood_group, is_available)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Blood requests (posted by hospitals)
CREATE TABLE IF NOT EXISTS blood_requests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    hospital_id INT NOT NULL,
    blood_group ENUM('A+','A-','B+','B-','O+','O-','AB+','AB-') NOT NULL,
    units_needed INT NOT NULL DEFAULT 1,
    urgency ENUM('low', 'medium', 'critical') NOT NULL DEFAULT 'medium',
    status ENUM('open', 'fulfilled', 'closed') NOT NULL DEFAULT 'open',
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (hospital_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_status (status),
    INDEX idx_blood_group_req (blood_group),
    INDEX idx_urgency (urgency)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Donations (links donors to requests)
CREATE TABLE IF NOT EXISTS donations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    donor_id INT NOT NULL,
    request_id INT NOT NULL,
    donated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    units INT NOT NULL DEFAULT 1,
    status ENUM('pending', 'confirmed') NOT NULL DEFAULT 'pending',
    FOREIGN KEY (donor_id) REFERENCES donors(id) ON DELETE CASCADE,
    FOREIGN KEY (request_id) REFERENCES blood_requests(id) ON DELETE CASCADE,
    INDEX idx_donor (donor_id),
    INDEX idx_request (request_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Notifications
CREATE TABLE IF NOT EXISTS notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    type ENUM('alert', 'update', 'badge') NOT NULL DEFAULT 'update',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_user_read (user_id, is_read)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Badges (gamification)
CREATE TABLE IF NOT EXISTS badges (
    id INT AUTO_INCREMENT PRIMARY KEY,
    donor_id INT NOT NULL,
    badge_name VARCHAR(50) NOT NULL,
    awarded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (donor_id) REFERENCES donors(id) ON DELETE CASCADE,
    INDEX idx_donor_badge (donor_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Trigger: After a donation is inserted, update donor stats
DELIMITER //
CREATE TRIGGER after_donation_insert
AFTER INSERT ON donations
FOR EACH ROW
BEGIN
    UPDATE donors
    SET 
        total_donations = total_donations + NEW.units,
        last_donated_date = DATE(NEW.donated_at),
        is_available = CASE
            WHEN DATEDIFF(NOW(), NEW.donated_at) < 56 THEN FALSE
            ELSE is_available
        END
    WHERE id = NEW.donor_id;
END //
DELIMITER ;

-- Trigger: After donation status changes to 'confirmed', award badges
DELIMITER //
CREATE TRIGGER after_donation_confirmed
AFTER UPDATE ON donations
FOR EACH ROW
BEGIN
    DECLARE donation_count INT;
    DECLARE donor_user_id INT;
    
    IF NEW.status = 'confirmed' AND OLD.status != 'confirmed' THEN
        -- Count total confirmed donations for this donor
        SELECT COUNT(*) INTO donation_count
        FROM donations
        WHERE donor_id = NEW.donor_id AND status = 'confirmed';
        
        -- Get the user_id for notifications
        SELECT user_id INTO donor_user_id
        FROM donors
        WHERE id = NEW.donor_id;
        
        -- Award "First Drop" badge at 1 confirmed donation
        IF donation_count = 1 THEN
            INSERT INTO badges (donor_id, badge_name) VALUES (NEW.donor_id, 'First Drop');
            INSERT INTO notifications (user_id, message, type)
            VALUES (donor_user_id, 'Congratulations! You earned the "First Drop" badge for your first donation!', 'badge');
        END IF;
        
        -- Award "Life Saver" badge at 5 confirmed donations
        IF donation_count = 5 THEN
            INSERT INTO badges (donor_id, badge_name) VALUES (NEW.donor_id, 'Life Saver');
            INSERT INTO notifications (user_id, message, type)
            VALUES (donor_user_id, 'Amazing! You earned the "Life Saver" badge for 5 donations!', 'badge');
        END IF;
        
        -- Award "Hero" badge at 10 confirmed donations
        IF donation_count = 10 THEN
            INSERT INTO badges (donor_id, badge_name) VALUES (NEW.donor_id, 'Hero');
            INSERT INTO notifications (user_id, message, type)
            VALUES (donor_user_id, 'Legendary! You earned the "Hero" badge for 10 donations!', 'badge');
        END IF;
    END IF;
END //
DELIMITER ;

-- View: Eligible donors (available AND last donation >= 56 days ago or never donated)
CREATE OR REPLACE VIEW eligible_donors AS
SELECT 
    d.id AS donor_id,
    d.user_id,
    u.name,
    u.email,
    u.phone,
    u.city,
    u.pincode,
    u.latitude,
    u.longitude,
    u.avatar_url,
    d.blood_group,
    d.last_donated_date,
    d.is_available,
    d.total_donations,
    d.weight_kg,
    CASE 
        WHEN d.last_donated_date IS NULL THEN 0
        ELSE GREATEST(0, 56 - DATEDIFF(NOW(), d.last_donated_date))
    END AS days_until_eligible
FROM donors d
JOIN users u ON d.user_id = u.id
WHERE d.is_available = TRUE
  AND (d.last_donated_date IS NULL OR DATEDIFF(NOW(), d.last_donated_date) >= 56);

-- Procedure: Find eligible donors by blood group and city
DELIMITER //
CREATE PROCEDURE find_donors(
    IN p_blood_group VARCHAR(5),
    IN p_city VARCHAR(100)
)
BEGIN
    SELECT 
        d.id AS donor_id,
        d.user_id,
        u.name,
        u.email,
        u.phone,
        u.city,
        u.pincode,
        u.latitude,
        u.longitude,
        u.avatar_url,
        d.blood_group,
        d.last_donated_date,
        d.is_available,
        d.total_donations,
        d.weight_kg
    FROM donors d
    JOIN users u ON d.user_id = u.id
    WHERE d.is_available = TRUE
      AND (d.last_donated_date IS NULL OR DATEDIFF(NOW(), d.last_donated_date) >= 56)
      AND (p_blood_group IS NULL OR p_blood_group = '' OR d.blood_group = p_blood_group)
      AND (p_city IS NULL OR p_city = '' OR u.city LIKE CONCAT('%', p_city, '%'))
    ORDER BY d.total_donations DESC;
END //
DELIMITER ;
