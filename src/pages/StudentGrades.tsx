import { useState, useEffect } from 'react';
import {
  Award,
  TrendingUp,
  BarChart3,
  BookOpen,
  Loader2,
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { AppLayout } from '@/components/AppLayout';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  PieChart,
  Pie,
  Legend,
} from 'recharts';

interface Grade {
  id: string;
  subject: string;
  grade: number;
  max_grade: number;
  term: string;
  academic_year: string;
  grade_date: string;
  notes: string | null;
}

const getGradeLabel = (percentage: number) => {
  if (percentage >= 90) return { label: 'A+', color: 'bg-success text-success-foreground' };
  if (percentage >= 85) return { label: 'A', color: 'bg-success text-success-foreground' };
  if (percentage >= 80) return { label: 'A-', color: 'bg-success/80 text-success-foreground' };
  if (percentage >= 75) return { label: 'B+', color: 'bg-primary text-primary-foreground' };
  if (percentage >= 70) return { label: 'B', color: 'bg-primary text-primary-foreground' };
  if (percentage >= 60) return { label: 'C', color: 'bg-warning text-warning-foreground' };
  if (percentage >= 50) return { label: 'D', color: 'bg-accent text-accent-foreground' };
  return { label: 'F', color: 'bg-destructive text-destructive-foreground' };
};

const getBarColor = (percentage: number) => {
  if (percentage >= 85) return 'hsl(var(--success))';
  if (percentage >= 70) return 'hsl(var(--primary))';
  if (percentage >= 50) return 'hsl(var(--warning))';
  return 'hsl(var(--destructive))';
};

const StudentGrades = () => {
  const { user } = useAuth();
  const [grades, setGrades] = useState<Grade[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState<string>('all');
  const [selectedTerm, setSelectedTerm] = useState<string>('all');

  const fetchGrades = async () => {
    if (!user) return;
    setLoading(true);
    const { data, error } = await supabase
      .from('student_grades')
      .select('*')
      .eq('student_id', user.id)
      .order('grade_date', { ascending: false });
    if (!error && data) setGrades(data);
    setLoading(false);
  };

  useEffect(() => {
    if (!user) return;
    fetchGrades();
  }, [user]);

  // Realtime
  useEffect(() => {
    if (!user) return;
    const channel = supabase
      .channel('student-grades-realtime')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'student_grades',
        filter: `student_id=eq.${user.id}`,
      }, () => { fetchGrades(); })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [user]);

  const academicYears = [...new Set(grades.map((g) => g.academic_year))].sort().reverse();
  const terms = [...new Set(grades.map((g) => g.term))];

  const filtered = grades.filter((g) => {
    if (selectedYear !== 'all' && g.academic_year !== selectedYear) return false;
    if (selectedTerm !== 'all' && g.term !== selectedTerm) return false;
    return true;
  });

  const avgPercentage = filtered.length
    ? filtered.reduce((sum, g) => sum + (g.grade / g.max_grade) * 100, 0) / filtered.length
    : 0;
  const highestGrade = filtered.length ? Math.max(...filtered.map((g) => (g.grade / g.max_grade) * 100)) : 0;
  const lowestGrade = filtered.length ? Math.min(...filtered.map((g) => (g.grade / g.max_grade) * 100)) : 0;

  const subjectMap = new Map<string, { total: number; count: number }>();
  filtered.forEach((g) => {
    const pct = (g.grade / g.max_grade) * 100;
    const existing = subjectMap.get(g.subject) || { total: 0, count: 0 };
    subjectMap.set(g.subject, { total: existing.total + pct, count: existing.count + 1 });
  });
  const barData = [...subjectMap.entries()].map(([subject, { total, count }]) => ({
    subject,
    score: Math.round(total / count),
  }));

  const distMap = { A: 0, B: 0, C: 0, D: 0, F: 0 };
  filtered.forEach((g) => {
    const pct = (g.grade / g.max_grade) * 100;
    if (pct >= 80) distMap.A++;
    else if (pct >= 70) distMap.B++;
    else if (pct >= 60) distMap.C++;
    else if (pct >= 50) distMap.D++;
    else distMap.F++;
  });
  const pieData = [
    { name: 'A (80-100)', value: distMap.A, color: 'hsl(var(--success))' },
    { name: 'B (70-79)', value: distMap.B, color: 'hsl(var(--primary))' },
    { name: 'C (60-69)', value: distMap.C, color: 'hsl(var(--warning))' },
    { name: 'D (50-59)', value: distMap.D, color: 'hsl(var(--accent))' },
    { name: 'F (<50)', value: distMap.F, color: 'hsl(var(--destructive))' },
  ].filter((d) => d.value > 0);

  return (
    <AppLayout title="My Grades">
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : grades.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <Award className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
            <h2 className="font-display text-xl font-semibold mb-2">No Grades Yet</h2>
            <p className="text-muted-foreground">
              Your grades will appear here once they are recorded by your parent or teacher.
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="flex flex-wrap gap-4 mb-8">
            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger className="w-[200px]"><SelectValue placeholder="Academic Year" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Years</SelectItem>
                {academicYears.map((y) => <SelectItem key={y} value={y}>{y}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={selectedTerm} onValueChange={setSelectedTerm}>
              <SelectTrigger className="w-[200px]"><SelectValue placeholder="Term" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Terms</SelectItem>
                {terms.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[
              { label: 'Average', value: `${avgPercentage.toFixed(1)}%`, icon: TrendingUp },
              { label: 'Highest', value: `${highestGrade.toFixed(1)}%`, icon: Award },
              { label: 'Lowest', value: `${lowestGrade.toFixed(1)}%`, icon: BarChart3 },
              { label: 'Total Grades', value: `${filtered.length}`, icon: BookOpen },
            ].map((stat) => (
              <div key={stat.label} className="card-elevated p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="p-2 rounded-lg bg-primary/10"><stat.icon className="h-5 w-5 text-primary" /></div>
                </div>
                <div className="font-display text-3xl font-bold mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-2 gap-6 mb-8">
            {barData.length > 0 && (
              <Card>
                <CardHeader><CardTitle className="font-display text-lg">Subject Performance</CardTitle></CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={barData} layout="vertical" margin={{ left: 60, right: 20 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis type="number" domain={[0, 100]} stroke="hsl(var(--muted-foreground))" fontSize={12} />
                        <YAxis dataKey="subject" type="category" stroke="hsl(var(--muted-foreground))" fontSize={12} width={80} />
                        <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
                        <Bar dataKey="score" radius={[0, 4, 4, 0]}>
                          {barData.map((entry, i) => <Cell key={i} fill={getBarColor(entry.score)} />)}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            )}
            {pieData.length > 0 && (
              <Card>
                <CardHeader><CardTitle className="font-display text-lg">Grade Distribution</CardTitle></CardHeader>
                <CardContent>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={2} dataKey="value">
                          {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                        </Pie>
                        <Tooltip contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }} />
                        <Legend formatter={(value) => <span style={{ color: 'hsl(var(--foreground))', fontSize: '12px' }}>{value}</span>} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          <Card>
            <CardHeader><CardTitle className="font-display text-lg">All Grades ({filtered.length})</CardTitle></CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Subject</TableHead>
                    <TableHead>Score</TableHead>
                    <TableHead>Grade</TableHead>
                    <TableHead>Term</TableHead>
                    <TableHead>Year</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((g) => {
                    const pct = (g.grade / g.max_grade) * 100;
                    const gradeInfo = getGradeLabel(pct);
                    return (
                      <TableRow key={g.id}>
                        <TableCell className="font-medium">{g.subject}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <span className="text-sm font-medium w-20">{g.grade}/{g.max_grade}</span>
                            <Progress value={pct} className="h-2 flex-1 max-w-[100px]" />
                          </div>
                        </TableCell>
                        <TableCell><Badge className={gradeInfo.color}>{gradeInfo.label}</Badge></TableCell>
                        <TableCell className="text-muted-foreground">{g.term}</TableCell>
                        <TableCell className="text-muted-foreground">{g.academic_year}</TableCell>
                        <TableCell className="text-muted-foreground">{new Date(g.grade_date).toLocaleDateString()}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </>
      )}
    </AppLayout>
  );
};

export default StudentGrades;
