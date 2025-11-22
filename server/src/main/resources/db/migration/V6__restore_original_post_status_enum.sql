-- Restore original 5-state post status enum
-- Map current PUBLIC/PRIVATE back to original values

-- First remap data: PUBLIC -> PUBLISHED, PRIVATE -> DRAFT
UPDATE posts SET status = 'PUBLISHED' WHERE status = 'PUBLIC';
UPDATE posts SET status = 'DRAFT' WHERE status = 'PRIVATE';

-- Alter enum back to original 5 states
ALTER TABLE posts
  MODIFY COLUMN status ENUM('DRAFT', 'PENDING_REVIEW', 'PUBLISHED', 'ARCHIVED', 'HIDDEN') NOT NULL DEFAULT 'DRAFT';
