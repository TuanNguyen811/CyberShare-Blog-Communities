-- Alter posts.status enum to new values and remap any legacy entries
ALTER TABLE posts
  MODIFY COLUMN status ENUM('PRIVATE','PUBLIC') NOT NULL DEFAULT 'PRIVATE';

-- Remap any leftover legacy values (if V4 failed earlier due to enum mismatch)
UPDATE posts SET status = 'PUBLIC' WHERE status = 'PUBLISHED';
UPDATE posts SET status = 'PRIVATE' WHERE status NOT IN ('PUBLIC','PRIVATE');
