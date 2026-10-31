import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  BookOpen,
  TrendingUp,
  Calendar,
  Plus,
  ChevronRight,
  Loader2,
  Sparkles,
  ArrowUpRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AppLayout } from '@/components/AppLayout';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/contexts/LanguageContext';
import { supabase } from '@/integrations/supabase/client';

interface ChildSummary {
  id: string;
  full_name: string | null;
  email: string;
  avgGrade: number;
  gradeCount: number;
}

interface ActivityItem {
  id: string;
  action: string;
  description: string | null;
  created_at: string;
}

const Dashboard = () => {
  const { t } = useLanguage();
  const { user, profile, isAdmin, isStudent } = useAuth();
  const [children, setChildren] = useState<ChildSummary[]>([]);
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [studentGrades, setStudentGrades] = useState<{ subject: string; grade: number; max_grade: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    loadData();
  }, [user, isAdmin, isStudent]);

  const loadData = async () => {
    setLoading(true);
    try {
      const { data: activityData } = await supabase
        .from('activity_log')
        .select('id, action, description, created_at')
        .eq('user_id', user!.id)
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (activityData) setActivities(activityData);

      if (isAdmin) {
        const { data: rels } = await supabase
          .from('parent_child_relationships')
          .select('child_id')
          .eq('parent_id', user!.id);

        if (rels && rels.length > 0) {
          const childIds = rels.map(r => r.child_id);
          const { data: profiles } = await supabase.from('profiles').select('user_id, full_name, email').in('user_id', childIds);
          const { data: grades } = await supabase.from('student_grades').select('student_id, grade, max_grade').in('student_id', childIds);

          const childSummaries: ChildSummary[] = (profiles || []).map(p => {
            const childGrades = (grades || []).filter(g => g.student_id === p.user_id);
            const avg = childGrades.length > 0
              ? childGrades.reduce((sum, g) => sum + (g.grade / g.max_grade) * 100, 0) / childGrades.length : 0;
            return { id: p.user_id, full_name: p.full_name, email: p.email, avgGrade: Math.round(avg), gradeCount: childGrades.length };
          });
          setChildren(childSummaries);
        }
      }

      if (isStudent) {
        const { data: grades } = await supabase
          .from('student_grades')
          .select('subject, grade, max_grade')
          .eq('student_id', user!.id)
          .order('grade_date', { ascending: false })
          .limit(10);
        if (grades) setStudentGrades(grades);
      }
    } catch (err) {
      console.error('Dashboard load error:', err);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (!user) return;
    const channel = supabase
      .channel('dashboard-grades')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'student_grades' }, () => loadData())
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [user]);

  const overallAverage = isAdmin
    ? (children.length > 0 ? Math.round(children.reduce((s, c) => s + c.avgGrade, 0) / children.length) : 0)
    : (studentGrades.length > 0 ? Math.round(studentGrades.reduce((s, g) => s + (g.grade / g.max_grade) * 100, 0) / studentGrades.length) : 0);

  const formatTimeAgo = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  };

  const getGradeColor = (pct: number) =>
    pct >= 85 ? 'text-success' : pct >= 70 ? 'text-warning' : 'text-destructive';

  const getGradeBg = (pct: number) =>
    pct >= 85 ? 'bg-success/10' : pct >= 70 ? 'bg-warning/10' : 'bg-destructive/10';

  const stats = [
    ...(isAdmin ? [{
      icon: Users,
      value: children.length,
      label: t('dashboard.students'),
      color: 'bg-primary/10 text-primary',
      trend: '+2 this year',
    }] : []),
    {
      icon: TrendingUp,
      value: `${overallAverage}%`,
      label: t('dashboard.average'),
      color: 'bg-success/10 text-success',
      trend: overallAverage >= 70 ? '↑ Great progress' : 'Keep going',
    },
    {
      icon: BookOpen,
      value: isAdmin ? children.reduce((s, c) => s + c.gradeCount, 0) : studentGrades.length,
      label: 'Total Grades',
      color: 'bg-secondary/10 text-secondary',
      trend: 'All recorded',
    },
    {
      icon: Calendar,
      value: activities.length,
      label: 'Recent Activities',
      color: 'bg-accent/10 text-accent',
      trend: 'Last 30 days',
    },
  ];

  return (
    <AppLayout title={t('nav.dashboard')}>
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading your dashboard...</p>
        </div>
      ) : (
        <>
          {/* Welcome Banner */}
          <div className="relative mb-8 p-6 md:p-8 rounded-2xl bg-gradient-to-br from-primary/10 via-primary/5 to-accent/10 border border-primary/10 overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-secondary/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-1/2 w-60 h-60 bg-accent/10 rounded-full blur-3xl" />
            <div className="relative">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="h-5 w-5 text-secondary" />
                <span className="text-sm font-medium text-secondary">
                  {isAdmin ? 'Parent Dashboard' : 'Student Dashboard'}
                </span>
              </div>
              <h2 className="font-display text-2xl md:text-3xl font-bold mb-2">
                {t('dashboard.welcome')}, {profile?.full_name?.split(' ')[0] || 'User'} 👋
              </h2>
              <p className="text-muted-foreground max-w-lg">
                {isAdmin
                  ? "Here's an overview of your family's academic progress. Keep tracking to stay informed!"
                  : "Here's your academic progress overview. Keep up the great work!"}
              </p>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map((stat, i) => (
              <div key={i} className="group relative p-5 rounded-2xl bg-card border border-border/50 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-transparent to-transparent group-hover:from-primary/[0.02] group-hover:to-accent/[0.02] transition-all" />
                <div className="relative">
                  <div className={`inline-flex items-center justify-center w-10 h-10 rounded-xl ${stat.color} mb-3 group-hover:scale-110 transition-transform`}>
                    <stat.icon className="h-5 w-5" />
                  </div>
                  <div className="font-display text-2xl md:text-3xl font-bold mb-0.5">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {isAdmin && (
                <div className="rounded-2xl bg-card border border-border/50 shadow-sm overflow-hidden">
                  <div className="flex items-center justify-between p-6 border-b border-border/50">
                    <div>
                      <h3 className="font-display text-xl font-semibold">{t('dashboard.students')}</h3>
                      <p className="text-sm text-muted-foreground mt-1">Your children's progress</p>
                    </div>
                    <Link to="/students">
                      <Button variant="hero" size="sm" className="rounded-xl">
                        <Plus className="h-4 w-4 mr-1" />
                        Manage
                      </Button>
                    </Link>
                  </div>
                  {children.length === 0 ? (
                    <div className="p-8 text-center">
                      <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                        <Users className="h-8 w-8 text-primary" />
                      </div>
                      <p className="text-muted-foreground mb-4">No children linked yet</p>
                      <Link to="/settings">
                        <Button variant="outline" size="sm" className="rounded-xl">Add Children in Settings</Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="divide-y divide-border/50">
                      {children.map((child) => (
                        <div key={child.id} className="flex items-center gap-4 p-5 hover:bg-muted/30 transition-colors group/item cursor-pointer">
                          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                            <span className="font-bold text-primary text-sm">
                              {child.full_name?.split(' ').map(n => n[0]).join('') || '?'}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="font-medium truncate">{child.full_name || child.email}</div>
                            <div className="text-sm text-muted-foreground">{child.gradeCount} grades recorded</div>
                          </div>
                          <div className="text-right">
                            <div className={`text-lg font-bold ${getGradeColor(child.avgGrade)}`}>
                              {child.avgGrade > 0 ? `${child.avgGrade}%` : 'N/A'}
                            </div>
                            {child.avgGrade > 0 && (
                              <div className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full ${getGradeBg(child.avgGrade)} ${getGradeColor(child.avgGrade)}`}>
                                {child.avgGrade >= 85 ? 'Excellent' : child.avgGrade >= 70 ? 'Good' : 'Needs work'}
                              </div>
                            )}
                          </div>
                          <ArrowUpRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover/item:opacity-100 transition-opacity" />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {isStudent && (
                <div className="rounded-2xl bg-card border border-border/50 shadow-sm overflow-hidden">
                  <div className="flex items-center justify-between p-6 border-b border-border/50">
                    <div>
                      <h3 className="font-display text-xl font-semibold">Recent Grades</h3>
                      <p className="text-sm text-muted-foreground mt-1">Your latest academic results</p>
                    </div>
                    <Link to="/my-grades">
                      <Button variant="hero" size="sm" className="rounded-xl">View All</Button>
                    </Link>
                  </div>
                  {studentGrades.length === 0 ? (
                    <div className="p-8 text-center">
                      <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                        <BookOpen className="h-8 w-8 text-primary" />
                      </div>
                      <p className="text-muted-foreground">No grades recorded yet.</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-border/50">
                      {studentGrades.slice(0, 5).map((g, i) => {
                        const pct = Math.round((g.grade / g.max_grade) * 100);
                        return (
                          <div key={i} className="flex items-center gap-4 p-5 hover:bg-muted/30 transition-colors">
                            <div className={`w-10 h-10 rounded-xl ${getGradeBg(pct)} flex items-center justify-center`}>
                              <span className={`text-sm font-bold ${getGradeColor(pct)}`}>{pct}%</span>
                            </div>
                            <div className="flex-1">
                              <div className="font-medium">{g.subject}</div>
                              <div className="text-sm text-muted-foreground">{g.grade}/{g.max_grade}</div>
                            </div>
                            <div className="h-2 w-24 bg-muted rounded-full overflow-hidden">
                              <div className={`h-full rounded-full transition-all ${pct >= 85 ? 'bg-success' : pct >= 70 ? 'bg-warning' : 'bg-destructive'}`} style={{ width: `${pct}%` }} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Activity Feed */}
            <div className="rounded-2xl bg-card border border-border/50 shadow-sm overflow-hidden h-fit">
              <div className="p-6 border-b border-border/50">
                <h3 className="font-display text-lg font-semibold">Recent Activity</h3>
                <p className="text-sm text-muted-foreground mt-1">What's been happening</p>
              </div>
              <div className="p-4">
                {activities.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center mx-auto mb-3">
                      <Calendar className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <p className="text-sm text-muted-foreground">No recent activity</p>
                  </div>
                ) : (
                  <div className="space-y-1">
                    {activities.slice(0, 8).map((activity) => (
                      <div key={activity.id} className="flex gap-3 p-3 rounded-xl hover:bg-muted/30 transition-colors">
                        <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                        <div className="min-w-0">
                          <p className="text-sm leading-relaxed truncate">{activity.description || activity.action}</p>
                          <p className="text-xs text-muted-foreground mt-0.5">{formatTimeAgo(activity.created_at)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </AppLayout>
  );
};

export default Dashboard;
