-- Fix mapping of jobs and job_steps

-- 1. Add processing_item_id to jobs
ALTER TABLE public.jobs ADD COLUMN IF NOT EXISTS processing_item_id INTEGER REFERENCES public.processing_items(processing_item_id);

-- 2. Add item_type_id to job_steps
ALTER TABLE public.job_steps ADD COLUMN IF NOT EXISTS item_type_id INTEGER REFERENCES public.item_types(item_type_id);
