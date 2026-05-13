DROP POLICY IF EXISTS "Anyone can insert leads" ON public.leads;
DROP POLICY IF EXISTS "Anyone can update leads" ON public.leads;

CREATE POLICY "Public can insert valid leads"
ON public.leads FOR INSERT TO anon, authenticated
WITH CHECK (
  email IS NOT NULL
  AND char_length(email) BETWEEN 5 AND 254
  AND email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
  AND converted = false
);

CREATE POLICY "Public can update unconverted leads"
ON public.leads FOR UPDATE TO anon, authenticated
USING (converted = false)
WITH CHECK (
  converted = false
  AND email IS NOT NULL
  AND char_length(email) BETWEEN 5 AND 254
  AND email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'
);