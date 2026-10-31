import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { BookOpen, Plus, Pencil, RotateCcw, Loader2, Search } from 'lucide-react';
import { QURAN_SURAHS } from '@/data/islamicLearningData';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { validateProgress, summarizeProgress, type QuranProgress } from '@/lib/islamicProgress';

interface Props { studentId: string; adminId: string; studentName: string; progress: QuranProgress[]; canEdit: boolean; onRefresh: () => void; }
const statuses: Record<string, string> = { not_started: 'Not started', in_progress: 'Learning', memorized: 'Memorized', revision: 'Revision' };
export const QuranTracker = ({ studentId, adminId, studentName, progress, canEdit, onRefresh }: Props) => {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [surahNumber, setSurahNumber] = useState('');
  const [status, setStatus] = useState('in_progress');
  const [verses, setVerses] = useState(0);
  const [tajweed, setTajweed] = useState('beginner');
  const [reviewed, setReviewed] = useState('');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const summary = summarizeProgress(progress, []);
  const surah = QURAN_SURAHS.find(s => s.number === Number(surahNumber));
  const validation = validateProgress(Number(surahNumber), verses, status);
  const chooseSurah = (number: string) => {
    const item = progress.find(p => p.surah_number === Number(number));
    setSurahNumber(number); setStatus(item?.status ?? 'in_progress'); setVerses(item?.verses_memorized ?? 0);
    setTajweed(item?.tajweed_level ?? 'beginner'); setReviewed(item?.last_reviewed ?? ''); setNotes(item?.notes ?? '');
  };
  const save = async () => {
    if (!canEdit || !studentId || !adminId || !surah || validation) return;
    setSaving(true);
    const previous = progress.find(p => p.surah_number === surah.number);
    const today = new Date().toISOString().slice(0, 10);
    try {
      const { error } = await supabase.from('quran_memorization').upsert({
        student_id: studentId, admin_id: adminId, surah_number: surah.number, surah_name: surah.name, juz_number: surah.juz,
        total_verses: surah.verses, verses_memorized: verses, status, tajweed_level: tajweed, last_reviewed: reviewed || null,
        notes: notes.trim() || null, start_date: previous?.start_date ?? (status !== 'not_started' ? today : null),
        completion_date: verses === surah.verses ? previous?.completion_date ?? today : null,
      }, { onConflict: 'student_id,surah_number' });
      if (error) throw error;
      setOpen(false); onRefresh(); toast({ title: 'Quran progress saved' });
    } catch (e) { toast({ title: 'Could not save progress', description: e instanceof Error ? e.message : 'Please try again.', variant: 'destructive' }); }
    finally { setSaving(false); }
  };
  const markReviewed = async (item: QuranProgress) => {
    setSaving(true);
    const { error } = await supabase.from('quran_memorization').update({ last_reviewed: new Date().toISOString().slice(0, 10) }).eq('id', item.id).eq('student_id', studentId);
    setSaving(false);
    if (error) toast({ title: 'Could not save revision', description: error.message, variant: 'destructive' }); else { onRefresh(); toast({ title: 'Revision recorded' }); }
  };
  const filtered = progress.filter(p => (filter === 'all' || p.status === filter) && `${p.surah_number} ${p.surah_name} ${QURAN_SURAHS.find(s => s.number === p.surah_number)?.arabicName}`.toLowerCase().includes(search.toLowerCase()));
  return <div className="space-y-5">
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      {[['Surahs memorized', summary.memorized], ['Verses memorized', summary.verses], ['Surahs tracked', progress.length], ['Revision check-ins due', summary.revisionDue]].map(([label, value]) => <Card key={label}><CardContent className="p-4"><p className="text-2xl font-bold text-primary">{value}</p><p className="text-xs text-muted-foreground">{label}</p></CardContent></Card>)}
    </div>
    <div className="flex flex-wrap gap-3 items-center justify-between">
      <h3 className="font-display text-xl font-semibold">{studentName ? `${studentName}’s Quran journey` : 'Quran journey'}</h3>
      {canEdit && <Button onClick={() => { chooseSurah(''); setOpen(true); }}><Plus className="h-4 w-4 me-2" />Track Surah</Button>}
    </div>
    <div className="flex flex-col sm:flex-row gap-2">
      <div className="relative flex-1"><Search className="absolute start-3 top-3 h-4 w-4 text-muted-foreground" /><Input aria-label="Search tracked Surahs" className="ps-9" placeholder="Search Surahs" value={search} onChange={e => setSearch(e.target.value)} /></div>
      <Select value={filter} onValueChange={setFilter}><SelectTrigger className="sm:w-44" aria-label="Filter progress"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="all">All progress</SelectItem>{Object.entries(statuses).map(([key, label]) => <SelectItem key={key} value={key}>{label}</SelectItem>)}</SelectContent></Select>
    </div>
    {!filtered.length && <div className="py-10 text-center text-muted-foreground"><BookOpen className="mx-auto h-10 w-10 mb-3" /><p>{progress.length ? 'No matching Surahs' : 'No Quran progress recorded yet'}</p></div>}
    <div className="grid gap-3 lg:grid-cols-2">{filtered.map(item => <Card key={item.id}><CardContent className="p-4 space-y-3">
      <div className="flex gap-3 items-start justify-between"><div className="min-w-0"><h4 className="font-semibold">{item.surah_number}. {item.surah_name}</h4><p lang="ar" className="text-lg text-primary">{QURAN_SURAHS.find(s => s.number === item.surah_number)?.arabicName}</p><p className="text-xs text-muted-foreground">Starts in Juz {item.juz_number}</p></div><Badge variant={item.verses_memorized === item.total_verses ? 'default' : 'secondary'}>{statuses[item.status]}</Badge></div>
      <div><div className="flex justify-between text-xs mb-1"><span>{item.verses_memorized} / {item.total_verses} verses</span><span>{Math.round(item.verses_memorized / item.total_verses * 100)}%</span></div><Progress value={item.verses_memorized / item.total_verses * 100} className="h-2" /></div>
      <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground"><span>Tajweed: {item.tajweed_level ?? 'Not assessed'}</span><span>Last revision: {item.last_reviewed ?? 'Not recorded'}</span></div>
      {item.notes && <p className="text-sm break-words text-muted-foreground">{item.notes}</p>}
      {canEdit && <div className="flex gap-2"><Button size="sm" variant="outline" onClick={() => { chooseSurah(String(item.surah_number)); setOpen(true); }}><Pencil className="h-3.5 w-3.5 me-2" />Update</Button><Button size="sm" variant="ghost" disabled={saving || item.verses_memorized === 0} onClick={() => markReviewed(item)}><RotateCcw className="h-3.5 w-3.5 me-2" />Revised today</Button></div>}
    </CardContent></Card>)}</div>
    <Dialog open={open} onOpenChange={value => { if (!saving) setOpen(value); }}><DialogContent className="max-h-[90dvh] overflow-y-auto"><DialogHeader><DialogTitle>Track Quran progress</DialogTitle></DialogHeader>
      <form className="space-y-4" onSubmit={e => { e.preventDefault(); save(); }}>
        <div className="space-y-2"><Label>Surah</Label><Select value={surahNumber} onValueChange={chooseSurah}><SelectTrigger aria-label="Surah"><SelectValue placeholder="Select a Surah" /></SelectTrigger><SelectContent>{QURAN_SURAHS.map(s => <SelectItem key={s.number} value={String(s.number)}>{s.number}. {s.name} · {s.arabicName}</SelectItem>)}</SelectContent></Select></div>
        <div className="grid grid-cols-2 gap-3"><div className="space-y-2"><Label>Status</Label><Select value={status} onValueChange={value => { setStatus(value); if (value === 'memorized' && surah) setVerses(surah.verses); if (value === 'not_started') setVerses(0); }}><SelectTrigger aria-label="Status"><SelectValue /></SelectTrigger><SelectContent>{Object.entries(statuses).map(([key, label]) => <SelectItem key={key} value={key}>{label}</SelectItem>)}</SelectContent></Select></div><div className="space-y-2"><Label htmlFor="quran-verses">Verses memorized</Label><Input id="quran-verses" type="number" min={0} max={surah?.verses ?? 286} value={verses} onChange={e => setVerses(Number(e.target.value))} /></div></div>
        {surah && <p className="text-xs text-muted-foreground">{surah.verses} verses · starts in Juz {surah.juz}</p>}
        <div className="grid grid-cols-2 gap-3"><div className="space-y-2"><Label>Tajweed level</Label><Select value={tajweed} onValueChange={setTajweed}><SelectTrigger aria-label="Tajweed level"><SelectValue /></SelectTrigger><SelectContent>{['beginner', 'developing', 'confident'].map(level => <SelectItem key={level} value={level}>{level}</SelectItem>)}</SelectContent></Select></div><div className="space-y-2"><Label htmlFor="quran-reviewed">Last revision</Label><Input id="quran-reviewed" type="date" max={new Date().toISOString().slice(0,10)} value={reviewed} onChange={e => setReviewed(e.target.value)} /></div></div>
        <div className="space-y-2"><Label htmlFor="quran-notes">Learning notes</Label><Textarea id="quran-notes" maxLength={1000} value={notes} onChange={e => setNotes(e.target.value)} /></div>
        {surahNumber && validation && <p role="alert" className="text-sm text-destructive">{validation}</p>}
        <Button type="submit" className="w-full" disabled={saving || !!validation}>{saving && <Loader2 className="h-4 w-4 animate-spin me-2" />}Save Progress</Button>
      </form>
    </DialogContent></Dialog>
  </div>;
};
