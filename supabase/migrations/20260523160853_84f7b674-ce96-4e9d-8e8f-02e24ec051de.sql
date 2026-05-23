
-- 1. Add per-space webhook token column
ALTER TABLE public.spaces ADD COLUMN IF NOT EXISTS webhook_token text;

-- 2. Remove client direct UPDATE on spaces (clients use update_space_brief_by_token RPC)
DROP POLICY IF EXISTS "Clients can update own spaces" ON public.spaces;

-- 3. Rebuild get_project_by_token without stripe_session_id
DROP FUNCTION IF EXISTS public.get_project_by_token(uuid);
CREATE OR REPLACE FUNCTION public.get_project_by_token(_token uuid)
RETURNS TABLE (
  id uuid,
  client_name text,
  client_email text,
  stage text,
  notes text,
  deadline date,
  access_token uuid,
  created_at timestamptz
)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path = public
AS $$
  SELECT id, client_name, client_email, stage, notes, deadline, access_token, created_at
  FROM public.projects WHERE access_token = _token LIMIT 1
$$;

-- 4. Lock down SECURITY DEFINER function execution
REVOKE EXECUTE ON FUNCTION public.is_team_member() FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.user_owns_project(uuid) FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.get_project_by_token(uuid) FROM public;
REVOKE EXECUTE ON FUNCTION public.get_spaces_by_token(uuid) FROM public;
REVOKE EXECUTE ON FUNCTION public.get_messages_by_token(uuid) FROM public;
REVOKE EXECUTE ON FUNCTION public.insert_message_by_token(uuid, text) FROM public;
REVOKE EXECUTE ON FUNCTION public.update_space_brief_by_token(uuid, uuid, text, jsonb, text, text) FROM public;

GRANT EXECUTE ON FUNCTION public.is_team_member() TO authenticated;
GRANT EXECUTE ON FUNCTION public.user_owns_project(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_project_by_token(uuid) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_spaces_by_token(uuid) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.get_messages_by_token(uuid) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.insert_message_by_token(uuid, text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.update_space_brief_by_token(uuid, uuid, text, jsonb, text, text) TO anon, authenticated;

-- 5. Realtime channel authorization: only authenticated users may subscribe.
-- Row-level data filtering for postgres_changes is still enforced by the public.spaces RLS policies.
ALTER TABLE IF EXISTS realtime.messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Authenticated users can subscribe to realtime" ON realtime.messages;
CREATE POLICY "Authenticated users can subscribe to realtime"
ON realtime.messages
FOR SELECT
TO authenticated
USING (true);
