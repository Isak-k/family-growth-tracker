
-- Activity log table for tracking user actions
CREATE TABLE public.activity_log (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  action TEXT NOT NULL,
  description TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.activity_log ENABLE ROW LEVEL SECURITY;

-- Users can view their own activity
CREATE POLICY "Users can view their own activity"
ON public.activity_log
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Users can insert their own activity
CREATE POLICY "Users can insert their own activity"
ON public.activity_log
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Admins can view children's activity
CREATE POLICY "Admins can view children activity"
ON public.activity_log
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.parent_child_relationships
    WHERE parent_child_relationships.parent_id = auth.uid()
    AND parent_child_relationships.child_id = activity_log.user_id
  )
);

-- Enable realtime on student_grades
ALTER PUBLICATION supabase_realtime ADD TABLE public.student_grades;

-- Enable realtime on activity_log
ALTER PUBLICATION supabase_realtime ADD TABLE public.activity_log;
