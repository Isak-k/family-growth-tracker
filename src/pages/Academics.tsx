import { useState, useEffect } from 'react';
import { Plus, BookOpen, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AppLayout } from '@/components/AppLayout';
import { useLanguage } from '@/contexts/LanguageContext';
import { AcademicYearForm } from '@/components/academics/AcademicYearForm';
import { CourseForm } from '@/components/academics/CourseForm';
import { AcademicYearCard } from '@/components/academics/AcademicYearCard';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useActivityLog } from '@/hooks/useActivityLog';
import { toast } from 'sonner';

export interface GradingConfig {
  test: number;
  mid: number;
  final: number;
  assignment: number;
  bonusEnabled: boolean;
  bonusMax: number;
}

export interface Course {
  id: string;
  name: string;
  maxScore: number;
  gradingConfig: GradingConfig;
}

export interface AcademicYear {
  id: string;
  name: string;
  grade: string;
  year: string;
  startDate: string;
  endDate: string;
  courses: Course[];
}

const Academics = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { logActivity } = useActivityLog();
  const [academicYears, setAcademicYears] = useState<AcademicYear[]>([]);
  const [showYearForm, setShowYearForm] = useState(false);
  const [showCourseForm, setShowCourseForm] = useState(false);
  const [editingYear, setEditingYear] = useState<AcademicYear | null>(null);
  const [editingCourse, setEditingCourse] = useState<{ yearId: string; course: Course | null }>({ yearId: '', course: null });
  const [expandedYears, setExpandedYears] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAcademicYears = async () => {
    if (!user) return;
    setLoading(true);

    const { data: yearsData, error: yearsError } = await supabase
      .from('academic_years')
      .select('*')
      .order('created_at', { ascending: false });

    if (yearsError) {
      toast.error('Failed to load academic years');
      setLoading(false);
      return;
    }

    const yearIds = (yearsData || []).map(y => y.id);
    let coursesData: any[] = [];
    if (yearIds.length > 0) {
      const { data } = await supabase
        .from('courses')
        .select('*')
        .in('academic_year_id', yearIds)
        .order('name');
      coursesData = data || [];
    }

    const mapped: AcademicYear[] = (yearsData || []).map(y => ({
      id: y.id,
      name: y.name,
      grade: y.grade,
      year: y.year,
      startDate: y.start_date,
      endDate: y.end_date,
      courses: coursesData
        .filter(c => c.academic_year_id === y.id)
        .map(c => ({
          id: c.id,
          name: c.name,
          maxScore: c.max_score,
          gradingConfig: {
            test: c.grading_test,
            mid: c.grading_mid,
            final: c.grading_final,
            assignment: c.grading_assignment,
            bonusEnabled: c.bonus_enabled,
            bonusMax: c.bonus_max,
          },
        })),
    }));

    setAcademicYears(mapped);
    if (mapped.length > 0 && expandedYears.length === 0) {
      setExpandedYears([mapped[0].id]);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (user) fetchAcademicYears();
  }, [user]);

  const handleSaveYear = async (year: Omit<AcademicYear, 'id' | 'courses'>) => {
    if (!user) return;

    if (editingYear) {
      const { error } = await supabase
        .from('academic_years')
        .update({
          name: year.name,
          grade: year.grade,
          year: year.year,
          start_date: year.startDate,
          end_date: year.endDate,
        })
        .eq('id', editingYear.id);

      if (error) { toast.error('Failed to update academic year'); return; }
      toast.success('Academic year updated');
      logActivity('academic_year_updated', `Updated ${year.name}`);
    } else {
      const { error } = await supabase
        .from('academic_years')
        .insert({
          admin_id: user.id,
          name: year.name,
          grade: year.grade,
          year: year.year,
          start_date: year.startDate,
          end_date: year.endDate,
        });

      if (error) { toast.error('Failed to create academic year'); return; }
      toast.success('Academic year created');
      logActivity('academic_year_created', `Created ${year.name}`);
    }

    setShowYearForm(false);
    setEditingYear(null);
    fetchAcademicYears();
  };

  const handleDeleteYear = async (yearId: string) => {
    const year = academicYears.find(y => y.id === yearId);
    const { error } = await supabase.from('academic_years').delete().eq('id', yearId);
    if (error) { toast.error('Failed to delete academic year'); return; }
    toast.success('Academic year deleted');
    if (year) logActivity('academic_year_deleted', `Deleted ${year.name}`);
    fetchAcademicYears();
  };

  const handleSaveCourse = async (course: Omit<Course, 'id'>) => {
    if (editingCourse.course) {
      const { error } = await supabase
        .from('courses')
        .update({
          name: course.name,
          max_score: course.maxScore,
          grading_test: course.gradingConfig.test,
          grading_mid: course.gradingConfig.mid,
          grading_final: course.gradingConfig.final,
          grading_assignment: course.gradingConfig.assignment,
          bonus_enabled: course.gradingConfig.bonusEnabled,
          bonus_max: course.gradingConfig.bonusMax,
        })
        .eq('id', editingCourse.course.id);

      if (error) { toast.error('Failed to update course'); return; }
      toast.success('Course updated');
      logActivity('course_updated', `Updated course ${course.name}`);
    } else {
      const { error } = await supabase
        .from('courses')
        .insert({
          academic_year_id: editingCourse.yearId,
          name: course.name,
          max_score: course.maxScore,
          grading_test: course.gradingConfig.test,
          grading_mid: course.gradingConfig.mid,
          grading_final: course.gradingConfig.final,
          grading_assignment: course.gradingConfig.assignment,
          bonus_enabled: course.gradingConfig.bonusEnabled,
          bonus_max: course.gradingConfig.bonusMax,
        });

      if (error) { toast.error('Failed to add course'); return; }
      toast.success('Course added');
      logActivity('course_created', `Added course ${course.name}`);
    }

    setShowCourseForm(false);
    setEditingCourse({ yearId: '', course: null });
    fetchAcademicYears();
  };

  const handleDeleteCourse = async (yearId: string, courseId: string) => {
    const year = academicYears.find(y => y.id === yearId);
    const course = year?.courses.find(c => c.id === courseId);
    const { error } = await supabase.from('courses').delete().eq('id', courseId);
    if (error) { toast.error('Failed to delete course'); return; }
    toast.success('Course deleted');
    if (course) logActivity('course_deleted', `Deleted course ${course.name}`);
    fetchAcademicYears();
  };

  const toggleYearExpand = (yearId: string) => {
    setExpandedYears(prev => prev.includes(yearId) ? prev.filter(id => id !== yearId) : [...prev, yearId]);
  };

  return (
    <AppLayout title="Academic Management">
      <div className="flex items-center justify-between mb-8">
        <p className="text-muted-foreground">Manage academic years, courses, and grading configurations</p>
        <Button variant="hero" onClick={() => { setEditingYear(null); setShowYearForm(true); }}>
          <Plus className="h-4 w-4 mr-2" />
          Add Academic Year
        </Button>
      </div>

      {showYearForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <h2 className="font-display text-xl font-semibold mb-4">
              {editingYear ? 'Edit Academic Year' : 'Create Academic Year'}
            </h2>
            <AcademicYearForm
              initialData={editingYear}
              onSave={handleSaveYear}
              onCancel={() => { setShowYearForm(false); setEditingYear(null); }}
            />
          </div>
        </div>
      )}

      {showCourseForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-2xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <h2 className="font-display text-xl font-semibold mb-4">
              {editingCourse.course ? 'Edit Course' : 'Add Course'}
            </h2>
            <CourseForm
              initialData={editingCourse.course}
              onSave={handleSaveCourse}
              onCancel={() => { setShowCourseForm(false); setEditingCourse({ yearId: '', course: null }); }}
            />
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="space-y-4">
          {academicYears.map((year) => (
            <AcademicYearCard
              key={year.id}
              year={year}
              isExpanded={expandedYears.includes(year.id)}
              onToggleExpand={() => toggleYearExpand(year.id)}
              onEdit={() => { setEditingYear(year); setShowYearForm(true); }}
              onDelete={() => handleDeleteYear(year.id)}
              onAddCourse={() => { setEditingCourse({ yearId: year.id, course: null }); setShowCourseForm(true); }}
              onEditCourse={(course) => { setEditingCourse({ yearId: year.id, course }); setShowCourseForm(true); }}
              onDeleteCourse={(courseId) => handleDeleteCourse(year.id, courseId)}
            />
          ))}

          {academicYears.length === 0 && (
            <div className="text-center py-12">
              <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-display text-lg font-semibold mb-2">No Academic Years</h3>
              <p className="text-muted-foreground mb-4">Get started by creating your first academic year</p>
              <Button variant="hero" onClick={() => setShowYearForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Academic Year
              </Button>
            </div>
          )}
        </div>
      )}
    </AppLayout>
  );
};

export default Academics;
