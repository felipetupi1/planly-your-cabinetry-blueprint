
-- Create storage bucket for project files
INSERT INTO storage.buckets (id, name, public)
VALUES ('project-files', 'project-files', true)
ON CONFLICT (id) DO NOTHING;

-- Policies on storage.objects for this bucket
CREATE POLICY "Anyone can read project files"
ON storage.objects FOR SELECT
USING (bucket_id = 'project-files');

CREATE POLICY "Anyone can upload project files"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'project-files');

CREATE POLICY "Anyone can update project files"
ON storage.objects FOR UPDATE
USING (bucket_id = 'project-files');

CREATE POLICY "Anyone can delete project files"
ON storage.objects FOR DELETE
USING (bucket_id = 'project-files');

-- Internal admin notes table (not visible to client)
CREATE TABLE IF NOT EXISTS public.project_notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL,
  content text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.project_notes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read project notes"
ON public.project_notes FOR SELECT USING (true);

CREATE POLICY "Anyone can insert project notes"
ON public.project_notes FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can delete project notes"
ON public.project_notes FOR DELETE USING (true);
