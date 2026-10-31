ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS religion text;

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path TO 'public'
AS $function$
DECLARE
  user_role app_role;
BEGIN
  user_role := COALESCE((NEW.raw_user_meta_data->>'role')::app_role, 'student');
  INSERT INTO public.profiles (user_id, email, full_name, religion)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'full_name', ''), NULLIF(NEW.raw_user_meta_data->>'religion', ''));
  INSERT INTO public.user_roles (user_id, role) VALUES (NEW.id, user_role);
  INSERT INTO public.notification_preferences (user_id) VALUES (NEW.id);
  RETURN NEW;
END;
$function$;

CREATE OR REPLACE FUNCTION public.get_family_religion(_user_id uuid)
RETURNS text LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT COALESCE(
    (SELECT p.religion FROM public.parent_child_relationships r JOIN public.profiles p ON p.user_id = r.parent_id WHERE r.child_id = _user_id LIMIT 1),
    (SELECT religion FROM public.profiles WHERE user_id = _user_id)
  )
$$;

CREATE TABLE public.personal_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  title text NOT NULL,
  content text NOT NULL,
  category text NOT NULL DEFAULT 'memory',
  entry_date date NOT NULL DEFAULT CURRENT_DATE,
  is_private boolean NOT NULL DEFAULT true,
  language text NOT NULL DEFAULT 'en',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.personal_history TO authenticated;
GRANT ALL ON public.personal_history TO service_role;
ALTER TABLE public.personal_history ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Owner full access" ON public.personal_history FOR ALL TO authenticated
  USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE POLICY "Parents read shared entries" ON public.personal_history FOR SELECT TO authenticated
  USING (is_private = false AND EXISTS (SELECT 1 FROM public.parent_child_relationships r WHERE r.parent_id = auth.uid() AND r.child_id = personal_history.user_id));
CREATE TRIGGER personal_history_updated BEFORE UPDATE ON public.personal_history
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();