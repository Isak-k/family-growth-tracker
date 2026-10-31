import { useState, useEffect, useCallback } from 'react';
import { AppLayout } from '@/components/AppLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { BookOpen, Heart, GraduationCap, Sparkles, Users } from 'lucide-react';
import { QuranTracker } from '@/components/islamic/QuranTracker';
import { DuaLibrary } from '@/components/islamic/DuaLibrary';
import { CurriculumPlanner } from '@/components/islamic/CurriculumPlanner';
import { TarbiyahGoals } from '@/components/islamic/TarbiyahGoals';
import { getAgeGroup, AGE_GROUPS } from '@/data/islamicLearningData';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { StudyPlanGenerator } from '@/components/islamic/StudyPlanGenerator';
import { FamilyFollowUp } from '@/components/islamic/FamilyFollowUp';
import type { IslamicStudent, QuranProgress, LearningGoal } from '@/lib/islamicProgress';

const IslamicLearning = () => {
  const { user, isAdmin, isStudent, loading: authLoading, isMuslim } = useAuth();
  const [students, setStudents] = useState<IslamicStudent[]>([]);
  const [selectedStudentId, setSelectedStudentId] = useState('');
  const [quranProgress, setQuranProgress] = useState<QuranProgress[]>([]);
  const [learningGoals, setLearningGoals] = useState<LearningGoal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tab, setTab] = useState('quran');
  const [retry, setRetry] = useState(0);
  const selectedProgress = quranProgress.filter(p => p.student_id === selectedStudentId);
  const selectedGoals = learningGoals.filter(g => g.student_id === selectedStudentId);

  const selectedStudent = students.find(s => s.id === selectedStudentId);
  const ageGroup = selectedStudent ? getAgeGroup(selectedStudent.date_of_birth) : null;

  // Fetch students
  useEffect(() => {
    if (authLoading) return;
    let active = true;
    setStudents([]); setSelectedStudentId(''); setQuranProgress([]); setLearningGoals([]);
    if (!user) {
      setLoading(false);
      return;
    }
    const fetchStudents = async () => {
      setLoading(true); setError('');
      try {
        let query = supabase.from('students').select('id, admin_id, first_name, last_name, date_of_birth').order('first_name');
        if (isAdmin) query = query.eq('admin_id', user.id);
        else if (isStudent) {
          const { data: ownId, error: idError } = await supabase.rpc('my_student_id');
          if (idError) throw idError;
          if (!ownId) { if (active) setLoading(false); return; }
          query = query.eq('id', ownId);
        } else { if (active) setLoading(false); return; }
        const { data, error: studentError } = await query;
        if (studentError) throw studentError;
        if (active) { setStudents(data ?? []); setSelectedStudentId(data?.[0]?.id ?? ''); }
      } catch (e) {
        if (active) setError(e instanceof Error ? e.message : 'Could not load student records.');
      }
      if (active) setLoading(false);
    };
    fetchStudents();
    return () => { active = false; };
  }, [user?.id, authLoading, isAdmin, isStudent, retry]);

  const fetchProgress = useCallback(async () => {
    if (!students.length) return;
    const ids = students.map(s => s.id);
    const [quranRes, goalsRes] = await Promise.all([
      supabase
        .from('quran_memorization')
        .select('*')
        .in('student_id', ids)
        .order('surah_number'),
      supabase
        .from('islamic_learning_goals')
        .select('*')
        .in('student_id', ids)
        .order('created_at'),
    ]);
    if (quranRes.error || goalsRes.error) { setError(quranRes.error?.message ?? goalsRes.error?.message ?? 'Could not load learning progress.'); return; }
    setError('');
    setQuranProgress(quranRes.data || []);
    setLearningGoals(goalsRes.data || []);
  }, [students]);

  useEffect(() => {
    fetchProgress();
  }, [fetchProgress]);

  const curriculumGoals = selectedGoals.filter(
    g => !['tarbiyah', 'adab'].includes(g.category) || g.category === 'dua'
  );
  const tarbiyahGoals = selectedGoals.filter(
    g => ['tarbiyah', 'adab', 'aqeedah', 'fiqh'].includes(g.category)
  );

  if (loading || authLoading) {
    return (
      <AppLayout title="Islamic Learning">
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
        </div>
      </AppLayout>
    );
  }

  if (!isMuslim) return <AppLayout title="Islamic Learning"><p className="text-muted-foreground">Islamic Learning is available for families who choose Islam in Settings.</p></AppLayout>;

  return (
    <AppLayout title="Islamic Learning">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="font-display text-2xl font-bold flex items-center gap-2">
              🕌 Islamic Learning & Tarbiyah
            </h2>
            <p className="text-muted-foreground text-sm mt-1">
              {isAdmin ? 'Your family’s learning journey' : 'My learning journey'}
            </p>
          </div>

          {/* Student Selector */}
          {isAdmin && students.length > 0 && (
            <div className="flex items-center gap-3">
              <Select value={selectedStudentId} onValueChange={setSelectedStudentId}>
                <SelectTrigger className="w-[220px]">
                  <SelectValue placeholder="Select student" />
                </SelectTrigger>
                <SelectContent>
                  {students.map(s => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.first_name} {s.last_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {ageGroup && (
                <Badge variant="secondary" className="whitespace-nowrap">
                  Age Group: {ageGroup}
                </Badge>
              )}
            </div>
          )}
        </div>

        {error && <div role="alert" className="flex flex-wrap items-center gap-3 text-destructive"><p className="text-sm">{error}</p><Button variant="outline" onClick={() => setRetry(n => n + 1)}>Try again</Button></div>}
        {/* No students message */}
        {students.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center text-muted-foreground">
              <GraduationCap className="h-16 w-16 mx-auto mb-4 opacity-30" />
              <h3 className="font-display font-semibold text-lg mb-2">{isAdmin ? 'No children registered yet' : 'Student record not linked'}</h3>
              <p className="text-sm">{isAdmin ? 'Register your children on the Students page.' : 'Ask your parent to link your login email to your student record.'}</p>
            </CardContent>
          </Card>
        )}

        {/* Age group info */}
        {selectedStudent && !selectedStudent.date_of_birth && (
          <Card className="border-amber-500/30 bg-amber-500/5">
            <CardContent className="p-4 flex items-center gap-3">
              <span className="text-2xl">⚠️</span>
              <div>
                <p className="font-medium text-sm">Date of birth not set</p>
                <p className="text-xs text-muted-foreground">
                  Update {selectedStudent.first_name}'s profile with their date of birth to get age-based recommendations
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Tabs */}
        <Tabs value={tab} onValueChange={setTab} className="space-y-4">
          <TabsList className="flex w-full justify-start overflow-x-auto h-auto gap-1">
            <TabsTrigger value="duas" className="flex items-center gap-1.5 text-xs md:text-sm">
              <span className="text-base">🤲</span>
              <span>Du'as</span>
            </TabsTrigger>
            <TabsTrigger value="quran" className="flex items-center gap-1.5 text-xs md:text-sm">
              <BookOpen className="h-4 w-4" />
              <span>Quran</span>
            </TabsTrigger>
            {selectedStudentId && (
              <>
                <TabsTrigger value="curriculum" className="flex items-center gap-1.5 text-xs md:text-sm">
                  <GraduationCap className="h-4 w-4" />
                  <span>Curriculum</span>
                </TabsTrigger>
                <TabsTrigger value="tarbiyah" className="flex items-center gap-1.5 text-xs md:text-sm">
                  <Heart className="h-4 w-4" />
                  <span>Tarbiyah</span>
                </TabsTrigger>
              </>
            )}
            {selectedStudent && <TabsTrigger value="plan" className="gap-1.5 text-xs md:text-sm"><Sparkles className="h-4 w-4" />Study plan</TabsTrigger>}
            {isAdmin && students.length > 0 && <TabsTrigger value="family" className="gap-1.5 text-xs md:text-sm"><Users className="h-4 w-4" />Family</TabsTrigger>}
          </TabsList>

          <TabsContent value="duas">
            <DuaLibrary ageGroup={ageGroup} />
          </TabsContent>

          <TabsContent value="quran">
            <QuranTracker
              studentId={selectedStudentId}
              adminId={selectedStudent?.admin_id ?? ''}
              studentName={selectedStudent ? `${selectedStudent.first_name}` : ''}
              progress={selectedProgress}
              canEdit={!!selectedStudent && (isAdmin || isStudent)}
              onRefresh={fetchProgress}
            />
          </TabsContent>

          {selectedStudentId && (
            <>
              <TabsContent value="curriculum">
                <CurriculumPlanner
                  studentId={selectedStudentId}
                  ageGroup={ageGroup}
                  goals={curriculumGoals}
                  isAdmin={isAdmin}
                  onRefresh={fetchProgress}
                />
              </TabsContent>

              <TabsContent value="tarbiyah">
                <TarbiyahGoals
                  studentId={selectedStudentId}
                  ageGroup={ageGroup}
                  goals={tarbiyahGoals}
                  isAdmin={isAdmin}
                  onRefresh={fetchProgress}
                />
              </TabsContent>
            </>
          )}
          {selectedStudent && <TabsContent value="plan"><StudyPlanGenerator key={selectedStudent.id} student={selectedStudent} onRefresh={fetchProgress} /></TabsContent>}
          {isAdmin && <TabsContent value="family"><FamilyFollowUp students={students} progress={quranProgress} goals={learningGoals} onSelect={id => { setSelectedStudentId(id); setTab('quran'); }} /></TabsContent>}
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default IslamicLearning;
