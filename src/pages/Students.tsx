import { useState, useEffect } from 'react';
import { Plus, Search, Users, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AppLayout } from '@/components/AppLayout';
import { useLanguage } from '@/contexts/LanguageContext';
import { StudentForm } from '@/components/students/StudentForm';
import { StudentCard } from '@/components/students/StudentCard';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useActivityLog } from '@/hooks/useActivityLog';
import { toast } from 'sonner';

export interface Student {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  dateOfBirth: string;
  gender: 'male' | 'female';
  enrollmentDate: string;
  academicYearIds: string[];
  status: 'active' | 'inactive' | 'graduated';
  avatar?: string;
}

const Students = () => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const { logActivity } = useActivityLog();
  const [students, setStudents] = useState<Student[]>([]);
  const [academicYears, setAcademicYears] = useState<{ id: string; name: string }[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive' | 'graduated'>('all');
  const [loading, setLoading] = useState(true);

  const fetchStudents = async () => {
    if (!user) return;
    setLoading(true);

    // Fetch students
    const { data: studentsData, error: studentsError } = await supabase
      .from('students')
      .select('*')
      .order('created_at', { ascending: false });

    if (studentsError) {
      toast.error('Failed to load students');
      setLoading(false);
      return;
    }

    // Fetch student-academic-year assignments
    const studentIds = (studentsData || []).map(s => s.id);
    let assignments: { student_id: string; academic_year_id: string }[] = [];
    if (studentIds.length > 0) {
      const { data } = await supabase
        .from('student_academic_years')
        .select('student_id, academic_year_id')
        .in('student_id', studentIds);
      assignments = data || [];
    }

    const mapped: Student[] = (studentsData || []).map(s => ({
      id: s.id,
      firstName: s.first_name,
      lastName: s.last_name,
      email: s.email,
      dateOfBirth: s.date_of_birth || '',
      gender: s.gender as 'male' | 'female',
      enrollmentDate: s.enrollment_date,
      academicYearIds: assignments.filter(a => a.student_id === s.id).map(a => a.academic_year_id),
      status: s.status as 'active' | 'inactive' | 'graduated',
      avatar: s.avatar_url || undefined,
    }));

    setStudents(mapped);
    setLoading(false);
  };

  const fetchAcademicYears = async () => {
    const { data } = await supabase
      .from('academic_years')
      .select('id, name')
      .order('name');
    setAcademicYears(data || []);
  };

  useEffect(() => {
    if (user) {
      fetchStudents();
      fetchAcademicYears();
    }
  }, [user]);

  const handleSaveStudent = async (student: Omit<Student, 'id'> & { password?: string }) => {
    if (!user) return;

    if (editingStudent) {
      // Update student
      const { error } = await supabase
        .from('students')
        .update({
          first_name: student.firstName,
          last_name: student.lastName,
          email: student.email,
          date_of_birth: student.dateOfBirth || null,
          gender: student.gender,
          enrollment_date: student.enrollmentDate,
          status: student.status,
        })
        .eq('id', editingStudent.id);

      if (error) { toast.error('Failed to update student'); return; }

      // Update academic year assignments
      await supabase.from('student_academic_years').delete().eq('student_id', editingStudent.id);
      if (student.academicYearIds.length > 0) {
        await supabase.from('student_academic_years').insert(
          student.academicYearIds.map(ayId => ({ student_id: editingStudent.id, academic_year_id: ayId }))
        );
      }

      toast.success('Student updated');
      logActivity('student_updated', `Updated student ${student.firstName} ${student.lastName}`);
    } else {
      // Insert student
      const { data: newStudent, error } = await supabase
        .from('students')
        .insert({
          admin_id: user.id,
          first_name: student.firstName,
          last_name: student.lastName,
          email: student.email,
          date_of_birth: student.dateOfBirth || null,
          gender: student.gender,
          enrollment_date: student.enrollmentDate,
          status: student.status,
        })
        .select()
        .single();

      if (error || !newStudent) { toast.error('Failed to add student'); return; }

      // Insert academic year assignments
      if (student.academicYearIds.length > 0) {
        await supabase.from('student_academic_years').insert(
          student.academicYearIds.map(ayId => ({ student_id: newStudent.id, academic_year_id: ayId }))
        );
      }

      toast.success('Student added');
      logActivity('student_created', `Added student ${student.firstName} ${student.lastName}`);

      if (student.password) {
        const { data, error: fnErr } = await supabase.functions.invoke('create-child-account', {
          body: { email: student.email, password: student.password, fullName: `${student.firstName} ${student.lastName}` },
        });
        if (fnErr || data?.error) toast.error(`Login not created: ${data?.error || fnErr?.message}`);
        else toast.success(`Login ready — your child can sign in with ${student.email}`);
      }
    }

    setShowForm(false);
    setEditingStudent(null);
    fetchStudents();
  };

  const handleDeleteStudent = async (studentId: string) => {
    const student = students.find(s => s.id === studentId);
    const { error } = await supabase.from('students').delete().eq('id', studentId);
    if (error) { toast.error('Failed to delete student'); return; }
    toast.success('Student deleted');
    if (student) logActivity('student_deleted', `Deleted student ${student.firstName} ${student.lastName}`);
    fetchStudents();
  };

  const filteredStudents = students.filter(student => {
    const matchesSearch =
      student.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || student.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <AppLayout title="Students Management">
      <div className="flex flex-wrap gap-4 mb-8">
        <div className="relative flex-1 min-w-[200px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search students..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          {(['all', 'active', 'inactive', 'graduated'] as const).map((status) => (
            <Button
              key={status}
              variant={filterStatus === status ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilterStatus(status)}
              className="capitalize"
            >
              {status}
            </Button>
          ))}
        </div>
        <Button variant="hero" onClick={() => { setEditingStudent(null); setShowForm(true); }} className="ml-auto">
          <Plus className="h-4 w-4 mr-2" />
          Add Student
        </Button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card rounded-2xl p-6 max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <h2 className="font-display text-xl font-semibold mb-4">
              {editingStudent ? 'Edit Student' : 'Add New Student'}
            </h2>
            <StudentForm
              initialData={editingStudent}
              academicYears={academicYears}
              onSave={handleSaveStudent}
              onCancel={() => { setShowForm(false); setEditingStudent(null); }}
            />
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <>
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredStudents.map((student) => (
              <StudentCard
                key={student.id}
                student={student}
                academicYears={academicYears}
                onEdit={() => { setEditingStudent(student); setShowForm(true); }}
                onDelete={() => handleDeleteStudent(student.id)}
              />
            ))}
          </div>

          {filteredStudents.length === 0 && (
            <div className="text-center py-12">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-display text-lg font-semibold mb-2">No Students Found</h3>
              <p className="text-muted-foreground mb-4">
                {searchQuery || filterStatus !== 'all' ? 'Try adjusting your search or filters' : 'Get started by adding your first student'}
              </p>
              {!searchQuery && filterStatus === 'all' && (
                <Button variant="hero" onClick={() => setShowForm(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Student
                </Button>
              )}
            </div>
          )}
        </>
      )}
    </AppLayout>
  );
};

export default Students;
