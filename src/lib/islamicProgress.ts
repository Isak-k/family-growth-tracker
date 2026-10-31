import { z } from 'zod';
import { QURAN_SURAHS } from '@/data/islamicLearningData';
import type { Tables } from '@/integrations/supabase/types';

export type QuranProgress = Tables<'quran_memorization'>;
export type LearningGoal = Tables<'islamic_learning_goals'>;
export type IslamicStudent = Pick<Tables<'students'>, 'id' | 'admin_id' | 'first_name' | 'last_name' | 'date_of_birth'>;
export const studyPlanSchema = z.object({
  summary: z.string(), weekly_goal: z.string(),
  daily_routine: z.array(z.object({ time: z.string(), activity: z.string(), minutes: z.number().int().nonnegative() })),
  weekly_schedule: z.array(z.object({ day: z.string(), task: z.string() })).length(7),
  revision_tips: z.array(z.string()), family_tips: z.array(z.string()), encouragement: z.string(),
});
export type StudyPlan = z.infer<typeof studyPlanSchema>;
export function validateProgress(surahNumber: number, verses: number, status: string): string | null {
  const surah = QURAN_SURAHS.find(s => s.number === surahNumber);
  if (!surah) return 'Select a Surah.';
  if (!Number.isInteger(verses) || verses < 0 || verses > surah.verses) return `Enter 0–${surah.verses} verses.`;
  if (status === 'memorized' && verses !== surah.verses) return 'A memorized Surah must include all its verses.';
  return null;
}
export function summarizeProgress(progress: QuranProgress[], goals: LearningGoal[], today = new Date()) {
  return {
    memorized: progress.filter(p => p.verses_memorized === p.total_verses && p.total_verses > 0).length,
    verses: progress.reduce((sum, p) => sum + p.verses_memorized, 0),
    revisionDue: progress.filter(p => p.verses_memorized > 0 && (!p.last_reviewed || today.getTime() - new Date(`${p.last_reviewed}T00:00:00`).getTime() >= 7 * 86400000)).length,
    completedGoals: goals.filter(g => g.status === 'completed').length,
    totalGoals: goals.length,
  };
}