
-- Quran memorization tracking per student
CREATE TABLE public.quran_memorization (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  admin_id UUID NOT NULL,
  surah_number INTEGER NOT NULL,
  surah_name TEXT NOT NULL,
  juz_number INTEGER NOT NULL DEFAULT 1,
  status TEXT NOT NULL DEFAULT 'not_started',
  verses_memorized INTEGER NOT NULL DEFAULT 0,
  total_verses INTEGER NOT NULL DEFAULT 0,
  start_date DATE,
  completion_date DATE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(student_id, surah_number)
);

-- Islamic learning goals (curriculum, tarbiyah, dua progress)
CREATE TABLE public.islamic_learning_goals (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
  admin_id UUID NOT NULL,
  category TEXT NOT NULL, -- 'aqeedah', 'fiqh', 'seerah', 'arabic', 'tarbiyah', 'dua', 'adab'
  age_group TEXT NOT NULL, -- '0-3', '4-6', '7-10', '11-14', '15+'
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'not_started', -- 'not_started', 'in_progress', 'completed'
  target_date DATE,
  completed_date DATE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.quran_memorization ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.islamic_learning_goals ENABLE ROW LEVEL SECURITY;

-- RLS for quran_memorization (admin manages, student views own)
CREATE POLICY "Admins can insert own quran_memorization"
  ON public.quran_memorization FOR INSERT
  WITH CHECK (admin_id = auth.uid() AND has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can select own quran_memorization"
  ON public.quran_memorization FOR SELECT
  USING (admin_id = auth.uid());

CREATE POLICY "Admins can update own quran_memorization"
  ON public.quran_memorization FOR UPDATE
  USING (admin_id = auth.uid())
  WITH CHECK (admin_id = auth.uid());

CREATE POLICY "Admins can delete own quran_memorization"
  ON public.quran_memorization FOR DELETE
  USING (admin_id = auth.uid());

CREATE POLICY "Students can view own quran_memorization"
  ON public.quran_memorization FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.parent_child_relationships
    WHERE parent_child_relationships.child_id = auth.uid()
    AND parent_child_relationships.parent_id = quran_memorization.admin_id
  ) OR student_id IN (
    SELECT s.id FROM public.students s
    JOIN public.parent_child_relationships pcr ON pcr.parent_id = s.admin_id
    WHERE pcr.child_id = auth.uid()
  ));

-- RLS for islamic_learning_goals
CREATE POLICY "Admins can insert own islamic_learning_goals"
  ON public.islamic_learning_goals FOR INSERT
  WITH CHECK (admin_id = auth.uid() AND has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can select own islamic_learning_goals"
  ON public.islamic_learning_goals FOR SELECT
  USING (admin_id = auth.uid());

CREATE POLICY "Admins can update own islamic_learning_goals"
  ON public.islamic_learning_goals FOR UPDATE
  USING (admin_id = auth.uid())
  WITH CHECK (admin_id = auth.uid());

CREATE POLICY "Admins can delete own islamic_learning_goals"
  ON public.islamic_learning_goals FOR DELETE
  USING (admin_id = auth.uid());

CREATE POLICY "Students can view own islamic_learning_goals"
  ON public.islamic_learning_goals FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM public.parent_child_relationships
    WHERE parent_child_relationships.child_id = auth.uid()
    AND parent_child_relationships.parent_id = islamic_learning_goals.admin_id
  ));

-- Updated at triggers
CREATE TRIGGER update_quran_memorization_updated_at
  BEFORE UPDATE ON public.quran_memorization
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_islamic_learning_goals_updated_at
  BEFORE UPDATE ON public.islamic_learning_goals
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
