DROP POLICY "Students can view own quran_memorization" ON public.quran_memorization;
CREATE POLICY "Students can view own quran_memorization" ON public.quran_memorization FOR SELECT TO authenticated USING (student_id = public.my_student_id());
DROP POLICY "Students can view own islamic_learning_goals" ON public.islamic_learning_goals;
CREATE POLICY "Students can view own islamic_learning_goals" ON public.islamic_learning_goals FOR SELECT TO authenticated USING (student_id = public.my_student_id());
CREATE POLICY "Students can insert own learning goals" ON public.islamic_learning_goals FOR INSERT TO authenticated WITH CHECK (student_id = public.my_student_id() AND EXISTS (SELECT 1 FROM public.students s WHERE s.id = student_id AND s.admin_id = islamic_learning_goals.admin_id));
CREATE POLICY "Students can update own learning goals" ON public.islamic_learning_goals FOR UPDATE TO authenticated USING (student_id = public.my_student_id()) WITH CHECK (student_id = public.my_student_id());
CREATE OR REPLACE FUNCTION public.validate_islamic_student_owner() RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
 IF NOT EXISTS (SELECT 1 FROM public.students s WHERE s.id = NEW.student_id AND s.admin_id = NEW.admin_id) THEN RAISE EXCEPTION 'Student and family must match'; END IF;
 IF TG_OP = 'UPDATE' AND (NEW.student_id IS DISTINCT FROM OLD.student_id OR NEW.admin_id IS DISTINCT FROM OLD.admin_id) THEN RAISE EXCEPTION 'Learning record ownership cannot be changed'; END IF;
 RETURN NEW;
END; $$;
CREATE TRIGGER validate_quran_family BEFORE INSERT OR UPDATE ON public.quran_memorization FOR EACH ROW EXECUTE FUNCTION public.validate_islamic_student_owner();
CREATE TRIGGER validate_learning_goal_family BEFORE INSERT OR UPDATE ON public.islamic_learning_goals FOR EACH ROW EXECUTE FUNCTION public.validate_islamic_student_owner();
CREATE TRIGGER validate_study_plan_family BEFORE INSERT OR UPDATE ON public.islamic_study_plans FOR EACH ROW EXECUTE FUNCTION public.validate_islamic_student_owner();
CREATE OR REPLACE FUNCTION public.validate_quran_progress() RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
DECLARE counts integer[] := ARRAY[7,286,200,176,120,165,206,75,129,109,123,111,43,52,99,128,111,110,98,135,112,78,118,64,77,227,93,88,69,60,34,30,73,54,45,83,182,88,75,85,54,53,89,59,37,35,38,29,18,45,60,49,62,55,78,96,29,22,24,13,14,11,11,18,12,12,12,30,52,52,44,28,28,20,56,40,31,50,40,46,42,29,19,36,25,22,17,19,26,30,20,15,21,11,8,8,19,5,8,8,11,11,8,3,9,5,4,7,3,6,3,5,4,5,6];
BEGIN
 IF NEW.surah_number < 1 OR NEW.surah_number > 114 THEN RAISE EXCEPTION 'Select a valid Surah'; END IF;
 NEW.total_verses := counts[NEW.surah_number];
 IF NEW.verses_memorized < 0 OR NEW.verses_memorized > NEW.total_verses THEN RAISE EXCEPTION 'Verses must be within the Surah verse count'; END IF;
 IF NEW.status NOT IN ('not_started','in_progress','memorized','revision') THEN RAISE EXCEPTION 'Invalid progress status'; END IF;
 IF NEW.status = 'memorized' AND NEW.verses_memorized <> NEW.total_verses THEN RAISE EXCEPTION 'Memorized Surahs must include all verses'; END IF;
 RETURN NEW;
END; $$;
CREATE TRIGGER validate_quran_counts BEFORE INSERT OR UPDATE ON public.quran_memorization FOR EACH ROW EXECUTE FUNCTION public.validate_quran_progress();