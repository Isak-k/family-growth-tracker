CREATE OR REPLACE FUNCTION public.my_student_id()
RETURNS uuid LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT s.id FROM public.students s
  JOIN public.parent_child_relationships p ON p.parent_id = s.admin_id AND p.child_id = auth.uid()
  JOIN public.profiles pr ON pr.user_id = auth.uid()
  WHERE lower(s.email) = lower(pr.email)
  LIMIT 1
$$;

ALTER TABLE public.quran_memorization ADD COLUMN IF NOT EXISTS tajweed_level text;
ALTER TABLE public.quran_memorization ADD COLUMN IF NOT EXISTS last_reviewed date;

CREATE POLICY "Students can view own student row" ON public.students FOR SELECT TO authenticated USING (id = public.my_student_id());

CREATE POLICY "Students can insert own quran progress" ON public.quran_memorization FOR INSERT TO authenticated
  WITH CHECK (student_id = public.my_student_id() AND EXISTS (SELECT 1 FROM public.parent_child_relationships p WHERE p.child_id = auth.uid() AND p.parent_id = quran_memorization.admin_id));
CREATE POLICY "Students can update own quran progress" ON public.quran_memorization FOR UPDATE TO authenticated
  USING (student_id = public.my_student_id()) WITH CHECK (student_id = public.my_student_id());

CREATE TABLE public.islamic_study_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  admin_id uuid NOT NULL,
  created_by uuid NOT NULL,
  goals jsonb NOT NULL DEFAULT '{}'::jsonb,
  plan jsonb NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, DELETE ON public.islamic_study_plans TO authenticated;
GRANT ALL ON public.islamic_study_plans TO service_role;
ALTER TABLE public.islamic_study_plans ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Parents manage their children plans" ON public.islamic_study_plans FOR ALL TO authenticated
  USING (admin_id = auth.uid()) WITH CHECK (admin_id = auth.uid());
CREATE POLICY "Students view own plans" ON public.islamic_study_plans FOR SELECT TO authenticated
  USING (student_id = public.my_student_id());
CREATE POLICY "Students create own plans" ON public.islamic_study_plans FOR INSERT TO authenticated
  WITH CHECK (student_id = public.my_student_id() AND created_by = auth.uid());