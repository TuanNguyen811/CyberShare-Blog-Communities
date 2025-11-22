-- Convert existing post statuses to new PUBLIC/PRIVATE model
-- PUBLISHED -> PUBLIC
UPDATE posts SET status = 'PUBLIC' WHERE status = 'PUBLISHED';
-- Any other status becomes PRIVATE
UPDATE posts SET status = 'PRIVATE' WHERE status IN ('DRAFT','PENDING_REVIEW','ARCHIVED','HIDDEN');
