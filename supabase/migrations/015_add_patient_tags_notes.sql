-- Migration: 015_add_patient_tags_notes.sql
-- Description: Add tags, coordinator notes, and metadata support to patients table.

ALTER TABLE public.patients 
ADD COLUMN IF NOT EXISTS tags VARCHAR(64)[] DEFAULT '{}'::VARCHAR(64)[] NOT NULL,
ADD COLUMN IF NOT EXISTS coordinator_notes TEXT,
ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}'::jsonb NOT NULL;

COMMENT ON COLUMN public.patients.tags IS 'Array of descriptive tags for segmentation (e.g. VIP, Frequent, Ortho).';
COMMENT ON COLUMN public.patients.coordinator_notes IS 'Internal notes entered by clinical coordinators regarding patient preferences or history.';
COMMENT ON COLUMN public.patients.metadata IS 'Flexible JSONB metadata for future schema expansion (e.g., allergies, system flags).';
