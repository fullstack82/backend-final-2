CREATE DATABASE experiences;
use experiences;

CREATE TABLE IF NOT EXISTS users(
    id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(30) NOT NULL,
    surnames VARCHAR(30) NOT NULL,
    email VARCHAR(50) UNIQUE,
    discharge_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    birthdate DATE,
    city VARCHAR(30),
    password VARCHAR(30) NOT NULL,
    nickname VARCHAR (30) UNIQUE
);


CREATE TABLE IF NOT EXISTS experiences(
    id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    code INT UNSIGNED NOT NULL,
    name VARCHAR(30) NOT NULL,
    description VARCHAR(500),
    price DECIMAL(10, 2) DEFAULT 0,
    city VARCHAR(30) NOT NULL,
    occupied_places INT UNSIGNED NOT NULL,
    image VARCHAR(30) NOT NULL
);


CREATE TABLE IF NOT EXISTS bookings(
    id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    reservation_number INT UNSIGNED NOT NULL,
    price DECIMAL (10, 2) DEFAULT 0,
    city VARCHAR(30),
    use_date DATE NOT NULL,
    reservation_date DATE NOT NULL,
    free_places INT UNSIGNED NOT NULL,
    occupancy_limit:smallint UNSIGEND,
    id_experiences INT UNSIGNED,
    FOREIGN KEY (id_experiences) REFERENCES experiences(id),
    id_users INT UNSIGNED,
    FOREIGN KEY (id_users) REFERENCES users(id)
);


CREATE TABLE IF NOT EXISTS comments(
    id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    date DATE NOT NULL,
    rating tinyint,
    id_users INT UNSIGNED,
    FOREIGN KEY (id_users) REFERENCES users(id),
    id_experiences INT UNSIGNED,
    FOREIGN KEY (id_experiences) REFERENCES experiences(id)
);