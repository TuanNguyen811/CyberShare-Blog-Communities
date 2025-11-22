-- Add about column to users table
ALTER TABLE users
ADD COLUMN about TEXT AFTER bio;
