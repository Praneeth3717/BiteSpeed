CREATE DATABASE IF NOT EXISTS bitespeed;
USE bitespeed;

CREATE TABLE IF NOT EXISTS Contact (
    id INT AUTO_INCREMENT PRIMARY KEY,
    phoneNumber VARCHAR(20),
    email VARCHAR(255),
    linkedId INT NULL,
    linkPrecedence ENUM('primary','secondary') NOT NULL,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    deletedAt DATETIME NULL,
    FOREIGN KEY (linkedId) REFERENCES Contact(id)
);

CREATE INDEX idx_email ON Contact(email);
CREATE INDEX idx_phone ON Contact(phoneNumber);
CREATE INDEX idx_linkedId ON Contact(linkedId);