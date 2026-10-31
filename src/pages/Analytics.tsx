import { useState, useEffect } from 'react';
import {
  Users,
  BookOpen,
  TrendingUp,
  Download,
  FileText,
  Loader2,
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { AppLayout } from '@/components/AppLayout';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { CoursePerformanceChart } from '@/components/analytics/CoursePerformanceChart';
import { ProgressOverTimeChart } from '@/components/analytics/ProgressOverTimeChart';
import { SubjectRadarChart } from '@/components/analytics/SubjectRadarChart';
import { GradeDistributionChart } from '@/components/analytics/GradeDistributionChart';

const Analytics = () => {
  const { t } = useLanguage();
  const { user, isAdmin } = useAuth();
  const [selectedStudent, setSelectedStudent] = useState('all');
  const [selectedYear, setSelectedYear] = useState('all');
  const [childOptions, setChildOptions] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    loadFilters();
  }, [user, isAdmin]);

  const loadFilters = async () => {
    setLoading(true);
    if (isAdmin) {
      const { data: rels } = await supabase
        .from('parent_child_relationships')
        .select('child_id')
        .eq('parent_id', user!.id);

      if (rels && rels.length > 0) {
        const { data: profiles } = await supabase
          .from('profiles')
          .select('user_id, full_name, email')
          .in('user_id', rels.map(r => r.child_id));

        if (profiles) {
          setChildOptions(profiles.map(p => ({
            id: p.user_id,
            name: p.full_name || p.email,
          })));
        }
      }
    }
    setLoading(false);
  };

  const summaryStats = [
    { label: 'Average Score', value: '85.7%', change: '+2.3%', positive: true },
    { label: 'Highest Score', value: '98%', change: 'Mathematics', positive: true },
    { label: 'Courses Completed', value: '21/24', change: '87.5%', positive: true },
    { label: 'Improvement Rate', value: '+5.2%', change: 'vs last year', positive: true },
  ];

  return (
    <AppLayout title="Performance Analytics">
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <>
          {/* Filters */}
          <div className="flex flex-wrap gap-4 mb-8">
            {isAdmin && childOptions.length > 0 && (
              <Select value={selectedStudent} onValueChange={setSelectedStudent}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Select Student" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Students</SelectItem>
                  {childOptions.map(c => (
                    <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            <Select value={selectedYear} onValueChange={setSelectedYear}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Academic Year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Years</SelectItem>
                <SelectItem value="2017">2017 E.C.</SelectItem>
                <SelectItem value="2016">2016 E.C.</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {summaryStats.map((stat) => (
              <div key={stat.label} className="card-elevated p-6">
                <div className="text-sm text-muted-foreground mb-1">{stat.label}</div>
                <div className="font-display text-3xl font-bold mb-1">{stat.value}</div>
                <div className={`text-sm ${stat.positive ? 'text-success' : 'text-destructive'}`}>
                  {stat.change}
                </div>
              </div>
            ))}
          </div>

          {/* Charts */}
          <div id="analytics-charts">
            <div className="grid lg:grid-cols-2 gap-6 mb-8">
              <div className="card-elevated p-6">
                <h3 className="font-display text-lg font-semibold mb-4">Course-wise Performance</h3>
                <CoursePerformanceChart />
              </div>
              <div className="card-elevated p-6">
                <h3 className="font-display text-lg font-semibold mb-4">Progress Over Time</h3>
                <ProgressOverTimeChart />
              </div>
            </div>
            <div className="grid lg:grid-cols-2 gap-6">
              <div className="card-elevated p-6">
                <h3 className="font-display text-lg font-semibold mb-4">Subject Strengths</h3>
                <SubjectRadarChart />
              </div>
              <div className="card-elevated p-6">
                <h3 className="font-display text-lg font-semibold mb-4">Grade Distribution</h3>
                <GradeDistributionChart />
              </div>
            </div>
          </div>
        </>
      )}
    </AppLayout>
  );
};

export default Analytics;
