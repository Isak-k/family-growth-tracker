import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, CheckCircle2, Target } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  TARBIYAH_MILESTONES,
  CATEGORY_LABELS,
  type AgeGroup,
} from '@/data/islamicLearningData';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface TarbiyahGoal {
  id: string;
  category: string;
  title: string;
  description: string | null;
  status: string;
}

interface TarbiyahGoalsProps {
  studentId: string;
  ageGroup: AgeGroup | null;
  goals: TarbiyahGoal[];
  isAdmin: boolean;
  onRefresh: () => void;
}

export const TarbiyahGoals = ({ studentId, ageGroup, goals, isAdmin, onRefresh }: TarbiyahGoalsProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [customTitle, setCustomTitle] = useState('');
  const [customCategory, setCustomCategory] = useState('tarbiyah');

  const milestones = ageGroup
    ? TARBIYAH_MILESTONES.find(m => m.ageGroup === ageGroup)?.milestones || []
    : [];

  const completedCount = goals.filter(g => g.status === 'completed').length;
  const totalGoals = goals.length;

  const addMilestone = async (milestone: { title: string; description: string; category: string }) => {
    if (!user || !ageGroup) return;
    const { error } = await supabase.from('islamic_learning_goals').insert({
      student_id: studentId,
      admin_id: user.id,
      category: milestone.category,
      age_group: ageGroup,
      title: milestone.title,
      description: milestone.description,
      status: 'not_started',
    });
    if (!error) {
      toast({ title: 'Added!', description: `${milestone.title} added to tarbiyah goals` });
      onRefresh();
    }
  };

  const addCustomGoal = async () => {
    if (!user || !ageGroup || !customTitle.trim()) return;
    const { error } = await supabase.from('islamic_learning_goals').insert({
      student_id: studentId,
      admin_id: user.id,
      category: customCategory,
      age_group: ageGroup,
      title: customTitle.trim(),
      status: 'not_started',
    });
    if (!error) {
      toast({ title: 'Added!', description: 'Custom goal added' });
      setDialogOpen(false);
      setCustomTitle('');
      onRefresh();
    }
  };

  const toggleGoal = async (goal: TarbiyahGoal) => {
    if (!isAdmin) return;
    const newStatus = goal.status === 'completed' ? 'not_started' : 'completed';
    await supabase.from('islamic_learning_goals').update({
      status: newStatus,
      completed_date: newStatus === 'completed' ? new Date().toISOString().split('T')[0] : null,
    }).eq('id', goal.id);
    onRefresh();
  };

  const existingTitles = goals.map(g => g.title);

  return (
    <div className="space-y-6">
      {/* Progress Summary */}
      {totalGoals > 0 && (
        <Card className="bg-gradient-to-br from-teal-500/5 to-emerald-500/5 border-teal-500/20">
          <CardContent className="p-6 text-center">
            <Target className="h-8 w-8 mx-auto mb-2 text-teal-600 dark:text-teal-400" />
            <div className="text-3xl font-bold text-teal-600 dark:text-teal-400">
              {completedCount} / {totalGoals}
            </div>
            <p className="text-sm text-muted-foreground mt-1">Tarbiyah milestones achieved</p>
          </CardContent>
        </Card>
      )}

      {/* Current Goals */}
      {goals.length > 0 && (
        <div className="space-y-2">
          {goals.map(goal => {
            const cat = CATEGORY_LABELS[goal.category];
            return (
              <Card
                key={goal.id}
                className={`cursor-pointer hover:shadow-md transition-all ${goal.status === 'completed' ? 'bg-emerald-500/5 border-emerald-500/20' : ''}`}
                onClick={() => isAdmin && toggleGoal(goal)}
              >
                <CardContent className="p-3 flex items-center gap-3">
                  <CheckCircle2 className={`h-5 w-5 flex-shrink-0 ${
                    goal.status === 'completed' ? 'text-emerald-500' : 'text-muted-foreground/30'
                  }`} />
                  <div className="flex-1">
                    <span className={`font-medium text-sm ${goal.status === 'completed' ? 'line-through text-muted-foreground' : ''}`}>
                      {goal.title}
                    </span>
                    {goal.description && (
                      <p className="text-xs text-muted-foreground">{goal.description}</p>
                    )}
                  </div>
                  {cat && <Badge className={`${cat.color} text-[10px]`}>{cat.icon}</Badge>}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Admin Actions */}
      {isAdmin && ageGroup && (
        <>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full">
                <Plus className="h-4 w-4 mr-2" /> Add Custom Goal
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Custom Tarbiyah Goal</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Goal Title</Label>
                  <Input value={customTitle} onChange={e => setCustomTitle(e.target.value)} placeholder="e.g. Prays Fajr independently" />
                </div>
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select value={customCategory} onValueChange={setCustomCategory}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {Object.entries(CATEGORY_LABELS).map(([key, val]) => (
                        <SelectItem key={key} value={key}>{val.icon} {val.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={addCustomGoal} variant="hero" className="w-full">Add Goal</Button>
              </div>
            </DialogContent>
          </Dialog>

          {/* Suggested Milestones */}
          {milestones.length > 0 && (
            <div>
              <h3 className="font-display font-semibold text-lg mb-3">
                Suggested Milestones (Age {ageGroup})
              </h3>
              <div className="grid gap-2">
                {milestones.map((m, idx) => {
                  const alreadyAdded = existingTitles.includes(m.title);
                  const cat = CATEGORY_LABELS[m.category];
                  return (
                    <Card key={idx} className={alreadyAdded ? 'opacity-50' : 'hover:shadow-md'}>
                      <CardContent className="p-3 flex items-center justify-between gap-3">
                        <div className="flex items-center gap-3">
                          {cat && <span className="text-lg">{cat.icon}</span>}
                          <div>
                            <h4 className="font-medium text-sm">{m.title}</h4>
                            <p className="text-xs text-muted-foreground">{m.description}</p>
                          </div>
                        </div>
                        {!alreadyAdded && (
                          <Button size="sm" variant="ghost" onClick={() => addMilestone(m)}>
                            <Plus className="h-4 w-4" />
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
