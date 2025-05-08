
DROP TABLE IF EXISTS bookings;
DROP TABLE IF EXISTS facilities;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS transactions;
DROP TABLE IF EXISTS sessions;

-- TABEL USERS
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100) UNIQUE,
    password VARCHAR(255),
    phone VARCHAR(20),
    role ENUM('member', 'admin') DEFAULT 'member',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- TABEL FACILITIES
CREATE TABLE facilities (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    description TEXT,
    price_per_hour DECIMAL(10,2)
);

-- TABEL BOOKINGS
CREATE TABLE bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    facility_id INT,
    booking_date DATE,
    start_time TIME,
    end_time TIME,
    status ENUM('pending', 'confirmed', 'cancelled') DEFAULT 'pending',
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (facility_id) REFERENCES facilities(id)
);

-- TABEL TRANSACTIONS
CREATE TABLE transactions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  type ENUM('credit', 'debit', 'income', 'expense') NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  description VARCHAR(255),
  date DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- TABEL SESSIONS (Opsional untuk login sistem)
CREATE TABLE sessions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    token VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- DUMMY DATA USERS
INSERT INTO users (name, email, password, phone, role) VALUES
('Andi Setiawan', 'andi@example.com', 'hashedpassword1', '081234567890', 'member'),
('Budi Hartono', 'budi@example.com', 'hashedpassword2', '081298765432', 'member'),
('Admin Sport', 'admin@sportcenter.com', 'hashedadminpass', '080000000000', 'admin');

-- DUMMY DATA FACILITIES
INSERT INTO facilities (name, description, price_per_hour) VALUES
('Lapangan Futsal A', 'Lapangan indoor ukuran standar', 150000),
('Lapangan Basket B', 'Lapangan outdoor dengan pencahayaan malam', 120000),
('Lapangan Badminton C', 'Lapangan karpet standar turnamen', 100000);

-- DUMMY DATA BOOKINGS
INSERT INTO bookings (user_id, facility_id, booking_date, start_time, end_time, status) VALUES
(1, 1, '2025-05-10', '09:00:00', '10:00:00', 'confirmed'),
(2, 2, '2025-05-11', '14:00:00', '15:30:00', 'pending'),
(1, 3, '2025-05-12', '17:00:00', '18:00:00', 'cancelled');