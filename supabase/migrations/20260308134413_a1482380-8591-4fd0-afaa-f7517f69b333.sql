
-- Students table (admin-owned, linked to parent)
CREATE TABLE public.students (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id uuid NOT NULL,
  first_name text NOT NULL,
  last_name text NOT NULL,
  email text NOT NULL DEFAULT '',
  date_of_birth date,
  gender text NOT NULL DEFAULT 'male' CHECK (gender IN ('male', 'female')),
  enrollment_date date NOT NULL DEFAULT CURRENT_DATE,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'graduated')),
  avatar_url text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Academic years table (admin-owned)
CREATE TABLE public.academic_years (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id uuid NOT NULL,
  name text NOT NULL,
  grade text NOT NULL,
  year text NOT NULL,
  start_date date NOT NULL,
  end_date date NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Courses table (linked to academic year)
CREATE TABLE public.courses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  academic_year_id uuid NOT NULL REFERENCES public.academic_years(id) ON DELETE CASCADE,
  name text NOT NULL,
  max_score integer NOT NULL DEFAULT 100,
  grading_test integer NOT NULL DEFAULT 10,
  grading_mid integer NOT NULL DEFAULT 20,
  grading_final integer NOT NULL DEFAULT 50,
  grading_assignment integer NOT NULL DEFAULT 20,
  bonus_enabled boolean NOT NULL DEFAULT false,
  bonus_max integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Junction table: student <-> academic year
CREATE TABLE public.student_academic_years (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id uuid NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  academic_year_id uuid NOT NULL REFERENCES public.academic_years(id) ON DELETE CASCADE,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(student_id, academic_year_id)
);

-- Enable RLS
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.academic_years ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_academic_years ENABLE ROW LEVEL SECURITY;

-- Students RLS: admins can CRUD their own students
CREATE POLICY "Admins can select own students" ON public.students FOR SELECT USING (admin_id = auth.uid());
CREATE POLICY "Admins can insert own students" ON public.students FOR INSERT WITH CHECK (admin_id = auth.uid() AND has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update own students" ON public.students FOR UPDATE USING (admin_id = auth.uid()) WITH CHECK (admin_id = auth.uid());
CREATE POLICY "Admins can delete own students" ON public.students FOR DELETE USING (admin_id = auth.uid());

-- Academic years RLS
CREATE POLICY "Admins can select own academic_years" ON public.academic_years FOR SELECT USING (admin_id = auth.uid());
CREATE POLICY "Admins can insert own academic_years" ON public.academic_years FOR INSERT WITH CHECK (admin_id = auth.uid() AND has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update own academic_years" ON public.academic_years FOR UPDATE USING (admin_id = auth.uid()) WITH CHECK (admin_id = auth.uid());
CREATE POLICY "Admins can delete own academic_years" ON public.academic_years FOR DELETE USING (admin_id = auth.uid());

-- Courses RLS: via academic_year ownership
CREATE POLICY "Admins can select own courses" ON public.courses FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.academic_years WHERE academic_years.id = courses.academic_year_id AND academic_years.admin_id = auth.uid())
);
CREATE POLICY "Admins can insert own courses" ON public.courses FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.academic_years WHERE academic_years.id = courses.academic_year_id AND academic_years.admin_id = auth.uid())
);
CREATE POLICY "Admins can update own courses" ON public.courses FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.academic_years WHERE academic_years.id = courses.academic_year_id AND academic_years.admin_id = auth.uid())
);
CREATE POLICY "Admins can delete own courses" ON public.courses FOR DELETE USING (
  EXISTS (SELECT 1 FROM public.academic_years WHERE academic_years.id = courses.academic_year_id AND academic_years.admin_id = auth.uid())
);

-- Student-academic-years RLS: via student ownership
CREATE POLICY "Admins can select own student_academic_years" ON public.student_academic_years FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.students WHERE students.id = student_academic_years.student_id AND students.admin_id = auth.uid())
);
CREATE POLICY "Admins can insert own student_academic_years" ON public.student_academic_years FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.students WHERE students.id = student_academic_years.student_id AND students.admin_id = auth.uid())
);
CREATE POLICY "Admins can delete own student_academic_years" ON public.student_academic_years FOR DELETE USING (
  EXISTS (SELECT 1 FROM public.students WHERE students.id = student_academic_years.student_id AND students.admin_id = auth.uid())
);

-- Updated_at triggers
CREATE TRIGGER update_students_updated_at BEFORE UPDATE ON public.students FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_academic_years_updated_at BEFORE UPDATE ON public.academic_years FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_courses_updated_at BEFORE UPDATE ON public.courses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
