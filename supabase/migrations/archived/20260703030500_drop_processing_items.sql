-- Drop foreign keys linking to processing_items
ALTER TABLE jobs DROP CONSTRAINT IF EXISTS jobs_processing_item_id_fkey;
ALTER TABLE job_steps DROP CONSTRAINT IF EXISTS job_steps_processing_item_id_fkey;

-- Drop the columns
ALTER TABLE jobs DROP COLUMN IF EXISTS processing_item_id;
ALTER TABLE job_steps DROP COLUMN IF EXISTS processing_item_id;

-- Drop the redundant table
DROP TABLE IF EXISTS processing_items CASCADE;
