import { useEffect, useState } from 'react';
import { Sparkles, Loader2, CalendarDays, Heart, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { QURAN_SURAHS, getAgeGroup } from '@/data/islamicLearningData';
import { supabase } from '@/integrations/supabase/client';
import { useLanguage } from '@/contexts/LanguageContext';
import { studyPlanSchema, type StudyPlan, type IslamicStudent } from '@/lib/islamicProgress';
import type { Tables } from '@/integrations/supabase/types';

export function StudyPlanGenerator({ student, onRefresh }: { student: IslamicStudent; onRefresh: () => void }) {
  const { language } = useLanguage();
  const [plans, setPlans] = useState<Tables<'islamic_study_plans'>[]>([]);
  const [selected, setSelected] = useState('');
  const [target, setTarget] = useState('112');
  const [minutes, setMinutes] = useState(20);
  const [focus, setFocus] = useState('memorization');
  const [targetDate, setTargetDate] = useState('');
  const [notes, setNotes] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [goalBusy, setGoalBusy] = useState(false);
  const [goalSaved, setGoalSaved] = useState(false);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let active = true;
    setPlans([]); setSelected(''); setError(''); setLoading(true); setGoalSaved(false);
    supabase.from('islamic_study_plans').select('*').eq('student_id', student.id).order('created_at', { ascending: false }).then(({ data, error }) => {
      if (!active) return;
      if (error) setError('Could not load saved plans. Please try again.');
      setPlans(data ?? []); setSelected(data?.[0]?.id ?? ''); setLoading(false);
    });
    return () => { active = false; };
  }, [student.id]);
  const result = studyPlanSchema.safeParse(plans.find(p => p.id === selected)?.plan);
  const plan: StudyPlan | null = result.success ? result.data : null;
  const saveGoal = async () => {
    const surah = QURAN_SURAHS.find(s => String(s.number) === target);
    if (!surah) return;
    setGoalBusy(true); setError('');
    const title = `${focus === 'memorization' ? 'Memorize' : focus === 'revision' ? 'Revise' : focus === 'tajweed' ? 'Improve tajweed for' : 'Understand'} ${surah.name}`;
    const { data: existing, error: readError } = await supabase.from('islamic_learning_goals').select('id').eq('student_id', student.id).eq('title', title).limit(1);
    const values = { student_id: student.id, admin_id: student.admin_id, category: 'quran', age_group: getAgeGroup(student.date_of_birth) ?? 'unspecified', title, description: `${minutes} minutes daily`, target_date: targetDate || null, notes: notes || null };
    const { error: saveError } = readError ? { error: readError } : existing?.[0] ? await supabase.from('islamic_learning_goals').update(values).eq('id', existing[0].id) : await supabase.from('islamic_learning_goals').insert({ ...values, status: 'not_started' });
    setGoalBusy(false);
    if (saveError) setError(saveError.message); else { setGoalSaved(true); onRefresh(); }
  };
  const generate = async () => {
    setBusy(true); setError('');
    try {
      const { data, error } = await supabase.functions.invoke('generate-study-plan', { body: { studentId: student.id, targetSurah: QURAN_SURAHS.find(s => String(s.number) === target)?.name, dailyMinutes: minutes, focus, targetDate, notes, language } });
      if (error) {
        let message = error.message;
        if (error.context instanceof Response) { const body = await error.context.json().catch(() => null); message = body?.error ?? message; }
        throw new Error(message);
      }
      if (data?.error) throw new Error(data.error);
      if (!studyPlanSchema.safeParse(data?.plan).success || !data?.saved?.id) throw new Error('The plan could not be saved. Please try again.');
      setPlans(previous => [data.saved, ...previous]); setSelected(data.saved.id);
    } catch (e) { setError(e instanceof Error ? e.message : 'Could not generate your plan.'); }
    finally { setBusy(false); }
  };
  return <div className="space-y-6">
    <div className="border-b pb-4"><h3 className="font-display text-xl font-semibold flex gap-2 items-center"><Sparkles className="h-5 w-5 text-primary" />{student.first_name}’s study plan</h3></div>
    <form className="grid gap-4 md:grid-cols-2" onSubmit={e => { e.preventDefault(); generate(); }}>
      <div className="space-y-2"><Label>Target Surah</Label><Select value={target} onValueChange={value => { setTarget(value); setGoalSaved(false); }}><SelectTrigger aria-label="Target Surah"><SelectValue /></SelectTrigger><SelectContent>{QURAN_SURAHS.map(s => <SelectItem key={s.number} value={String(s.number)}>{s.number}. {s.name}</SelectItem>)}</SelectContent></Select></div>
      <div className="space-y-2"><Label>Focus</Label><Select value={focus} onValueChange={value => { setFocus(value); setGoalSaved(false); }}><SelectTrigger aria-label="Study focus"><SelectValue /></SelectTrigger><SelectContent>{['memorization', 'revision', 'tajweed', 'understanding'].map(f => <SelectItem key={f} value={f}>{f.charAt(0).toUpperCase() + f.slice(1)}</SelectItem>)}</SelectContent></Select></div>
      <div className="space-y-2"><Label htmlFor="study-minutes">Minutes per day</Label><Input id="study-minutes" type="number" min={5} max={180} required value={minutes} onChange={e => { setMinutes(Number(e.target.value)); setGoalSaved(false); }} /></div>
      <div className="space-y-2"><Label htmlFor="study-date">Target date (optional)</Label><Input id="study-date" type="date" min={new Date().toISOString().slice(0,10)} value={targetDate} onChange={e => { setTargetDate(e.target.value); setGoalSaved(false); }} /></div>
      <div className="space-y-2 md:col-span-2"><Label htmlFor="study-notes">My goals & learning needs</Label><Textarea id="study-notes" maxLength={1000} value={notes} onChange={e => { setNotes(e.target.value); setGoalSaved(false); }} /></div>
      <div className="flex flex-wrap gap-3 md:col-span-2"><Button type="submit" disabled={busy || minutes < 5 || minutes > 180}>{busy ? <Loader2 className="h-4 w-4 animate-spin me-2" /> : <Sparkles className="h-4 w-4 me-2" />}{busy ? 'Preparing your plan…' : 'Generate study plan'}</Button><Button type="button" variant="outline" disabled={goalBusy || goalSaved || minutes < 5 || minutes > 180} onClick={saveGoal}>{goalBusy ? 'Saving…' : goalSaved ? 'Goal saved' : 'Save learning goal'}</Button></div>
    </form>
    {error && <p role="alert" className="text-sm text-destructive break-words">{error}</p>}
    {loading && <Loader2 className="h-5 w-5 animate-spin" />}
    {plans.length > 0 && <div className="space-y-2"><Label>Saved plans</Label><Select value={selected} onValueChange={setSelected}><SelectTrigger aria-label="Saved plans"><SelectValue /></SelectTrigger><SelectContent>{plans.map((p, i) => <SelectItem key={p.id} value={p.id}>{new Date(p.created_at).toLocaleString()} · Plan {plans.length - i}</SelectItem>)}</SelectContent></Select></div>}
    {plan && <div className="space-y-6 border-t pt-6">
      <div><h4 className="font-display text-xl mb-2">This week</h4><p className="text-sm text-muted-foreground">{plan.summary}</p><p className="font-medium mt-3 text-primary">{plan.weekly_goal}</p></div>
      <div><h4 className="font-semibold flex gap-2 items-center mb-3"><BookOpen className="h-4 w-4" />Daily routine</h4><div className="divide-y">{plan.daily_routine.map((r, i) => <div key={i} className="py-3 flex gap-4 items-start"><span className="text-xs font-medium w-24 shrink-0">{r.time}<span className="block text-muted-foreground mt-1">{r.minutes} min</span></span><p className="text-sm">{r.activity}</p></div>)}</div></div>
      <div><h4 className="font-semibold flex gap-2 items-center mb-3"><CalendarDays className="h-4 w-4" />Weekly schedule</h4><div className="grid gap-3 sm:grid-cols-2">{plan.weekly_schedule.map((day, i) => <div key={i} className="border-s-2 border-primary ps-3 py-1"><p className="text-xs font-semibold text-primary">{day.day}</p><p className="text-sm mt-1">{day.task}</p></div>)}</div></div>
      <div className="grid gap-6 md:grid-cols-2">{[['Revision', plan.revision_tips], ['Family check-ins', plan.family_tips]].map(([title, tips]) => <div key={String(title)}><h4 className="font-semibold mb-2">{String(title)}</h4><ul className="list-disc ps-5 space-y-2 text-sm text-muted-foreground">{(tips as string[]).map((tip, i) => <li key={i}>{tip}</li>)}</ul></div>)}</div>
      <p className="flex gap-2 items-start text-sm text-primary"><Heart className="h-4 w-4 shrink-0 mt-1" />{plan.encouragement}</p>
      <p className="text-xs text-muted-foreground">AI-generated learning guidance, not a religious ruling. Review recitation and religious questions with a qualified teacher.</p>
    </div>}
  </div>;
}
