import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, CheckCircle2 } from 'lucide-react';
import {
  CURRICULUM_RECOMMENDATIONS,
  CATEGORY_LABELS,
  type AgeGroup,
} from '@/data/islamicLearningData';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface LearningGoal {
  id: string;
  category: string;
  title: string;
  description: string | null;
  status: string;
  age_group: string;
}

interface CurriculumPlannerProps {
  studentId: string;
  ageGroup: AgeGroup | null;
  goals: LearningGoal[];
  isAdmin: boolean;
  onRefresh: () => void;
}

export const CurriculumPlanner = ({ studentId, ageGroup, goals, isAdmin, onRefresh }: CurriculumPlannerProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState<string | null>(null);

  const recommendations = ageGroup
    ? CURRICULUM_RECOMMENDATIONS.find(c => c.ageGroup === ageGroup)?.subjects || []
    : [];

  const addGoal = async (subject: { category: string; title: string; description: string }) => {
    if (!user || !ageGroup) return;
    setLoading(subject.title);
    const { error } = await supabase.from('islamic_learning_goals').insert({
      student_id: studentId,
      admin_id: user.id,
      category: subject.category,
      age_group: ageGroup,
      title: subject.title,
      description: subject.description,
      status: 'not_started',
    });
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Added!', description: `${subject.title} added to learning plan` });
      onRefresh();
    }
    setLoading(null);
  };

  const toggleGoalStatus = async (goal: LearningGoal) => {
    if (!isAdmin) return;
    const newStatus = goal.status === 'completed' ? 'not_started' : goal.status === 'in_progress' ? 'completed' : 'in_progress';
    const { error } = await supabase
      .from('islamic_learning_goals')
      .update({
        status: newStatus,
        completed_date: newStatus === 'completed' ? new Date().toISOString().split('T')[0] : null,
      })
      .eq('id', goal.id);
    if (!error) onRefresh();
  };

  const existingTitles = goals.map(g => g.title);

  return (
    <div className="space-y-6">
      {/* Current Goals */}
      {goals.length > 0 && (
        <div>
          <h3 className="font-display font-semibold text-lg mb-3">Active Learning Plan</h3>
          <div className="space-y-2">
            {goals.map(goal => {
              const cat = CATEGORY_LABELS[goal.category];
              return (
                <Card
                  key={goal.id}
                  className={`cursor-pointer hover:shadow-md transition-all ${goal.status === 'completed' ? 'opacity-70' : ''}`}
                  onClick={() => isAdmin && toggleGoalStatus(goal)}
                >
                  <CardContent className="p-3 flex items-center gap-3">
                    <CheckCircle2 className={`h-5 w-5 flex-shrink-0 ${
                      goal.status === 'completed' ? 'text-emerald-500' :
                      goal.status === 'in_progress' ? 'text-amber-500' : 'text-muted-foreground/30'
                    }`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className={`font-medium text-sm ${goal.status === 'completed' ? 'line-through' : ''}`}>
                          {goal.title}
                        </span>
                        {cat && <Badge className={`${cat.color} text-[10px]`}>{cat.icon} {cat.label}</Badge>}
                      </div>
                      {goal.description && (
                        <p className="text-xs text-muted-foreground truncate">{goal.description}</p>
                      )}
                    </div>
                    <Badge variant="secondary" className="text-[10px] capitalize">{goal.status.replace('_', ' ')}</Badge>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* Recommendations */}
      {isAdmin && ageGroup && recommendations.length > 0 && (
        <div>
          <h3 className="font-display font-semibold text-lg mb-3">
            Recommended for Age {ageGroup}
          </h3>
          <div className="grid gap-3 md:grid-cols-2">
            {recommendations.map((subject, idx) => {
              const cat = CATEGORY_LABELS[subject.category];
              const alreadyAdded = existingTitles.includes(subject.title);
              return (
                <Card key={idx} className={`${alreadyAdded ? 'opacity-50' : 'hover:shadow-md'} transition-all`}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        {cat && (
                          <Badge className={`${cat.color} text-[10px] mb-2`}>{cat.icon} {cat.label}</Badge>
                        )}
                        <h4 className="font-semibold text-sm">{subject.title}</h4>
                        <p className="text-xs text-muted-foreground mt-1">{subject.description}</p>
                      </div>
                      {!alreadyAdded && (
                        <Button
                          size="sm"
                          variant="ghost"
                          className="flex-shrink-0"
                          onClick={() => addGoal(subject)}
                          disabled={loading === subject.title}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {!ageGroup && (
        <div className="text-center py-12 text-muted-foreground">
          <p className="text-4xl mb-3">📚</p>
          <p className="font-medium">Please add a date of birth for the student</p>
          <p className="text-sm mt-1">This helps us recommend age-appropriate Islamic curriculum</p>
        </div>
      )}
    </div>
  );
};
