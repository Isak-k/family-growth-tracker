-- Create storage bucket for avatars
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for avatars bucket
CREATE POLICY "Avatar images are publicly accessible"
ON storage.objects
FOR SELECT
USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload their own avatar"
ON storage.objects
FOR INSERT
WITH CHECK (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own avatar"
ON storage.objects
FOR UPDATE
USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own avatar"
ON storage.objects
FOR DELETE
USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Create student_grades table to store academic data for students
CREATE TABLE public.student_grades (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID NOT NULL,
  subject TEXT NOT NULL,
  grade DECIMAL(5,2) NOT NULL,
  max_grade DECIMAL(5,2) NOT NULL DEFAULT 100,
  term TEXT NOT NULL,
  academic_year TEXT NOT NULL,
  grade_date DATE NOT NULL DEFAULT CURRENT_DATE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on student_grades
ALTER TABLE public.student_grades ENABLE ROW LEVEL SECURITY;

-- Students can view their own grades
CREATE POLICY "Students can view their own grades"
ON public.student_grades
FOR SELECT
USING (auth.uid() = student_id);

-- Admins (parents) can view their children's grades
CREATE POLICY "Admins can view children grades"
ON public.student_grades
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM parent_child_relationships
    WHERE parent_id = auth.uid() AND child_id = student_grades.student_id
  )
);

-- Admins can insert grades for their children
CREATE POLICY "Admins can insert children grades"
ON public.student_grades
FOR INSERT
WITH CHECK (
  has_role(auth.uid(), 'admin') AND
  EXISTS (
    SELECT 1 FROM parent_child_relationships
    WHERE parent_id = auth.uid() AND child_id = student_grades.student_id
  )
);

-- Admins can update their children's grades
CREATE POLICY "Admins can update children grades"
ON public.student_grades
FOR UPDATE
USING (
  has_role(auth.uid(), 'admin') AND
  EXISTS (
    SELECT 1 FROM parent_child_relationships
    WHERE parent_id = auth.uid() AND child_id = student_grades.student_id
  )
);

-- Admins can delete their children's grades
CREATE POLICY "Admins can delete children grades"
ON public.student_grades
FOR DELETE
USING (
  has_role(auth.uid(), 'admin') AND
  EXISTS (
    SELECT 1 FROM parent_child_relationships
    WHERE parent_id = auth.uid() AND child_id = student_grades.student_id
  )
);

-- Create trigger for updated_at
CREATE TRIGGER update_student_grades_updated_at
BEFORE UPDATE ON public.student_grades
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();