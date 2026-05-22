
-- ============ HELPER FUNCTIONS ============
CREATE OR REPLACE FUNCTION public.is_team_member()
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (SELECT 1 FROM public.team_members WHERE user_id = auth.uid())
$$;

CREATE OR REPLACE FUNCTION public.user_owns_project(_project_id uuid)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.projects p
    WHERE p.id = _project_id
      AND lower(p.client_email) = lower(COALESCE(auth.jwt() ->> 'email', ''))
  )
$$;

-- ============ TOKEN-BASED RPCs (anon access via access_token) ============
CREATE OR REPLACE FUNCTION public.get_project_by_token(_token uuid)
RETURNS SETOF public.projects
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$ SELECT * FROM public.projects WHERE access_token = _token LIMIT 1 $$;

CREATE OR REPLACE FUNCTION public.get_spaces_by_token(_token uuid)
RETURNS SETOF public.spaces
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT s.* FROM public.spaces s
  JOIN public.projects p ON p.id = s.project_id
  WHERE p.access_token = _token
$$;

CREATE OR REPLACE FUNCTION public.update_space_brief_by_token(
  _token uuid, _space_id uuid, _description text, _room_data jsonb,
  _scan_status text, _scan_link text
) RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  UPDATE public.spaces s
  SET description = _description,
      room_data = _room_data,
      scan_status = COALESCE(_scan_status, s.scan_status),
      scan_link = COALESCE(_scan_link, s.scan_link)
  FROM public.projects p
  WHERE s.id = _space_id AND s.project_id = p.id AND p.access_token = _token;
END $$;

CREATE OR REPLACE FUNCTION public.get_messages_by_token(_token uuid)
RETURNS SETOF public.messages
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT m.* FROM public.messages m
  JOIN public.projects p ON p.id = m.project_id
  WHERE p.access_token = _token ORDER BY m.created_at ASC
$$;

CREATE OR REPLACE FUNCTION public.insert_message_by_token(_token uuid, _content text)
RETURNS public.messages LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  v_project_id uuid; v_row public.messages;
BEGIN
  SELECT id INTO v_project_id FROM public.projects WHERE access_token = _token;
  IF v_project_id IS NULL THEN RAISE EXCEPTION 'Invalid token'; END IF;
  IF _content IS NULL OR length(trim(_content)) = 0 THEN RAISE EXCEPTION 'Empty content'; END IF;
  IF length(_content) > 5000 THEN RAISE EXCEPTION 'Content too long'; END IF;
  INSERT INTO public.messages (project_id, content, from_role)
  VALUES (v_project_id, _content, 'client') RETURNING * INTO v_row;
  RETURN v_row;
END $$;

GRANT EXECUTE ON FUNCTION public.get_project_by_token(uuid) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_spaces_by_token(uuid) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.update_space_brief_by_token(uuid,uuid,text,jsonb,text,text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_messages_by_token(uuid) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.insert_message_by_token(uuid,text) TO anon, authenticated;

-- ============ PROJECTS ============
DROP POLICY IF EXISTS "Anyone can insert projects" ON public.projects;
DROP POLICY IF EXISTS "Anyone can read projects" ON public.projects;
DROP POLICY IF EXISTS "Anyone can update projects" ON public.projects;

CREATE POLICY "Team can read all projects" ON public.projects
  FOR SELECT TO authenticated USING (public.is_team_member());
CREATE POLICY "Clients can read own project" ON public.projects
  FOR SELECT TO authenticated
  USING (lower(client_email) = lower(COALESCE(auth.jwt() ->> 'email', '')));
CREATE POLICY "Team can update projects" ON public.projects
  FOR UPDATE TO authenticated
  USING (public.is_team_member()) WITH CHECK (public.is_team_member());

-- ============ SPACES ============
DROP POLICY IF EXISTS "Anyone can insert spaces" ON public.spaces;
DROP POLICY IF EXISTS "Anyone can read spaces" ON public.spaces;
DROP POLICY IF EXISTS "Anyone can update spaces" ON public.spaces;

CREATE POLICY "Team can read all spaces" ON public.spaces
  FOR SELECT TO authenticated USING (public.is_team_member());
CREATE POLICY "Clients can read own spaces" ON public.spaces
  FOR SELECT TO authenticated USING (public.user_owns_project(project_id));
CREATE POLICY "Team can update spaces" ON public.spaces
  FOR UPDATE TO authenticated
  USING (public.is_team_member()) WITH CHECK (public.is_team_member());
CREATE POLICY "Clients can update own spaces" ON public.spaces
  FOR UPDATE TO authenticated
  USING (public.user_owns_project(project_id))
  WITH CHECK (public.user_owns_project(project_id));

-- ============ MESSAGES ============
DROP POLICY IF EXISTS "Anyone can insert messages" ON public.messages;
DROP POLICY IF EXISTS "Anyone can read messages" ON public.messages;

CREATE POLICY "Team can read all messages" ON public.messages
  FOR SELECT TO authenticated USING (public.is_team_member());
CREATE POLICY "Clients can read own messages" ON public.messages
  FOR SELECT TO authenticated USING (public.user_owns_project(project_id));
CREATE POLICY "Team can insert messages" ON public.messages
  FOR INSERT TO authenticated WITH CHECK (public.is_team_member());
CREATE POLICY "Clients can insert own messages" ON public.messages
  FOR INSERT TO authenticated
  WITH CHECK (public.user_owns_project(project_id) AND from_role = 'client');

-- ============ PROJECT_NOTES (team only) ============
DROP POLICY IF EXISTS "Anyone can delete project notes" ON public.project_notes;
DROP POLICY IF EXISTS "Anyone can insert project notes" ON public.project_notes;
DROP POLICY IF EXISTS "Anyone can read project notes" ON public.project_notes;

CREATE POLICY "Team can read notes" ON public.project_notes
  FOR SELECT TO authenticated USING (public.is_team_member());
CREATE POLICY "Team can insert notes" ON public.project_notes
  FOR INSERT TO authenticated WITH CHECK (public.is_team_member());
CREATE POLICY "Team can delete notes" ON public.project_notes
  FOR DELETE TO authenticated USING (public.is_team_member());

-- ============ COSTS (team only) ============
DROP POLICY IF EXISTS "Anyone can delete costs" ON public.costs;
DROP POLICY IF EXISTS "Anyone can insert costs" ON public.costs;
DROP POLICY IF EXISTS "Anyone can read costs" ON public.costs;

CREATE POLICY "Team can read costs" ON public.costs
  FOR SELECT TO authenticated USING (public.is_team_member());
CREATE POLICY "Team can insert costs" ON public.costs
  FOR INSERT TO authenticated WITH CHECK (public.is_team_member());
CREATE POLICY "Team can delete costs" ON public.costs
  FOR DELETE TO authenticated USING (public.is_team_member());

-- ============ LEADS ============
DROP POLICY IF EXISTS "Public can update unconverted leads" ON public.leads;
CREATE POLICY "Team can read leads" ON public.leads
  FOR SELECT TO authenticated USING (public.is_team_member());
CREATE POLICY "Team can update leads" ON public.leads
  FOR UPDATE TO authenticated
  USING (public.is_team_member()) WITH CHECK (public.is_team_member());

-- ============ TEAM_MEMBERS ============
DROP POLICY IF EXISTS "Anon can read team_members for auth callback" ON public.team_members;
-- existing "Team members can read own record" policies remain (auth.uid() = user_id)

-- ============ STORAGE: project-files ============
UPDATE storage.buckets SET public = false WHERE id = 'project-files';

DO $$
DECLARE p record;
BEGIN
  FOR p IN
    SELECT policyname FROM pg_policies
    WHERE schemaname='storage' AND tablename='objects'
      AND (policyname ILIKE '%project-files%' OR policyname ILIKE '%project_files%' OR policyname ILIKE '%project files%')
  LOOP
    EXECUTE format('DROP POLICY %I ON storage.objects', p.policyname);
  END LOOP;
END $$;

CREATE POLICY "Team can read project-files" ON storage.objects
  FOR SELECT TO authenticated
  USING (bucket_id = 'project-files' AND public.is_team_member());
CREATE POLICY "Clients can read own project-files" ON storage.objects
  FOR SELECT TO authenticated
  USING (
    bucket_id = 'project-files'
    AND public.user_owns_project(((storage.foldername(name))[1])::uuid)
  );
CREATE POLICY "Team can upload project-files" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'project-files' AND public.is_team_member());
CREATE POLICY "Team can update project-files" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'project-files' AND public.is_team_member());
CREATE POLICY "Team can delete project-files" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'project-files' AND public.is_team_member());
