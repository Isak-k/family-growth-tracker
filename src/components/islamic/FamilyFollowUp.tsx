import { BookOpen, Heart, RotateCcw } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { AGE_GROUPS, getAgeGroup, TARBIYAH_MILESTONES } from '@/data/islamicLearningData';
import { summarizeProgress, type IslamicStudent, type QuranProgress, type LearningGoal } from '@/lib/islamicProgress';

export function FamilyFollowUp({ students, progress, goals, onSelect }: { students: IslamicStudent[]; progress: QuranProgress[]; goals: LearningGoal[]; onSelect: (id: string) => void }) {
  return <div className="space-y-8">
    <div className="grid gap-4 lg:grid-cols-2">{students.map(student => {
      const summary = summarizeProgress(progress.filter(p => p.student_id === student.id), goals.filter(g => g.student_id === student.id));
      const age = getAgeGroup(student.date_of_birth);
      return <Card key={student.id}><CardContent className="p-5 space-y-4">
        <div className="flex items-start justify-between gap-3"><div><h3 className="font-display text-lg font-semibold">{student.first_name} {student.last_name}</h3><p className="text-xs text-muted-foreground">{AGE_GROUPS.find(g => g.value === age)?.label ?? 'Date of birth not set'}</p></div><Button variant="outline" size="sm" onClick={() => onSelect(student.id)}>Follow up</Button></div>
        <div className="grid grid-cols-3 gap-3 text-sm"><div><BookOpen className="h-4 w-4 text-primary mb-2" /><p className="font-semibold">{summary.memorized} / 114</p><p className="text-xs text-muted-foreground">Surahs memorized</p></div><div><RotateCcw className="h-4 w-4 text-primary mb-2" /><p className="font-semibold">{summary.revisionDue}</p><p className="text-xs text-muted-foreground">Revision check-ins due</p></div><div><Heart className="h-4 w-4 text-primary mb-2" /><p className="font-semibold">{summary.completedGoals} / {summary.totalGoals}</p><p className="text-xs text-muted-foreground">Learning goals achieved</p></div></div>
        <Progress value={summary.memorized / 114 * 100} className="h-2" />
        {summary.revisionDue > 0 && <p className="text-xs text-muted-foreground">A gentle revision check-in is due for {summary.revisionDue} Surah{summary.revisionDue === 1 ? '' : 's'}.</p>}
      </CardContent></Card>;
    })}</div>
    <section className="border-t pt-6"><h3 className="font-display text-xl font-semibold mb-5">Growing in faith, together</h3><div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">{AGE_GROUPS.map(group => <div key={group.value} className="border-s-2 border-primary/40 ps-4"><h4 className="font-semibold text-sm">{group.label}</h4><p className="text-xs text-muted-foreground mt-1">{group.description}</p><ul className="list-disc ps-4 text-sm space-y-2 mt-3">{TARBIYAH_MILESTONES.find(m => m.ageGroup === group.value)?.milestones.slice(0, 3).map(m => <li key={m.title}>{m.title}</li>)}</ul></div>)}</div><p className="text-xs text-muted-foreground mt-6">Celebrate effort, listen patiently, and learn together. Milestones support learning; they do not measure a child’s faith or worth.</p></section>
  </div>;
}