
-- Allow anon to read projects (access_token acts as security)
CREATE POLICY "Anyone can read projects" ON public.projects FOR SELECT TO anon USING (true);
CREATE POLICY "Anyone can read spaces" ON public.spaces FOR SELECT TO anon USING (true);
CREATE POLICY "Anyone can read messages" ON public.messages FOR SELECT TO anon USING (true);
CREATE POLICY "Anyone can insert messages" ON public.messages FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Anyone can read costs" ON public.costs FOR SELECT TO anon USING (true);
CREATE POLICY "Anyone can update spaces" ON public.spaces FOR UPDATE TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Anyone can update projects" ON public.projects FOR UPDATE TO anon USING (true) WITH CHECK (true);
CREATE POLICY "Anyone can insert costs" ON public.costs FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Anyone can delete costs" ON public.costs FOR DELETE TO anon USING (true);
CREATE POLICY "Anyone can insert projects" ON public.projects FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "Anyone can insert spaces" ON public.spaces FOR INSERT TO anon WITH CHECK (true);
