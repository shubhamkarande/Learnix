-- Learnix Database Initialization Script
-- Run this script in MySQL Workbench or command line

-- Create the database
CREATE DATABASE IF NOT EXISTS learnix
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

-- Verify creation
SHOW DATABASES LIKE 'learnix';

-- Select the database
USE learnix;

-- Note: Spring Boot with JPA will auto-create tables on first run
-- when spring.jpa.hibernate.ddl-auto is set to 'update'
