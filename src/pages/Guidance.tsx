import { useState } from 'react';
import {
  GraduationCap,
  Search,
  CheckCircle2,
  AlertCircle,
  Info,
  ChevronDown,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { AppLayout } from '@/components/AppLayout';

const departments = [
  {
    category: 'Engineering & Technology',
    departments: [
      { name: 'Electrical Engineering', requirements: { math: 85, physics: 80 }, career: 'Power systems, Electronics' },
      { name: 'Civil Engineering', requirements: { math: 80, physics: 75 }, career: 'Construction, Infrastructure' },
      { name: 'Mechanical Engineering', requirements: { math: 82, physics: 78 }, career: 'Manufacturing, Automotive' },
      { name: 'Chemical Engineering', requirements: { math: 78, chemistry: 80 }, career: 'Process industries, Research' },
      { name: 'Software Engineering', requirements: { math: 80, physics: 70 }, career: 'Tech companies, Startups' },
    ],
  },
  {
    category: 'Computer Science & ICT',
    departments: [
      { name: 'Computer Science', requirements: { math: 82, physics: 75 }, career: 'Software development, AI' },
      { name: 'Information Technology', requirements: { math: 75, physics: 70 }, career: 'IT management, Systems' },
      { name: 'Information Systems', requirements: { math: 70, english: 75 }, career: 'Business analysis, Data' },
    ],
  },
  {
    category: 'Medicine & Health Sciences',
    departments: [
      { name: 'Medicine (MD)', requirements: { biology: 90, chemistry: 88 }, career: 'Hospitals, Clinics' },
      { name: 'Pharmacy', requirements: { biology: 85, chemistry: 85 }, career: 'Pharmacies, Research' },
      { name: 'Nursing', requirements: { biology: 75, chemistry: 70 }, career: 'Healthcare, Hospitals' },
      { name: 'Public Health', requirements: { biology: 78, chemistry: 72 }, career: 'Health organizations' },
    ],
  },
  {
    category: 'Business & Economics',
    departments: [
      { name: 'Accounting', requirements: { math: 75, english: 70 }, career: 'Finance, Auditing' },
      { name: 'Management', requirements: { math: 70, english: 75 }, career: 'Business leadership' },
      { name: 'Economics', requirements: { math: 80, english: 72 }, career: 'Policy, Banking' },
      { name: 'Marketing', requirements: { math: 65, english: 78 }, career: 'Advertising, Sales' },
    ],
  },
  {
    category: 'Natural Sciences',
    departments: [
      { name: 'Mathematics', requirements: { math: 88, physics: 75 }, career: 'Teaching, Research' },
      { name: 'Physics', requirements: { math: 85, physics: 88 }, career: 'Research, Academia' },
      { name: 'Chemistry', requirements: { chemistry: 85, math: 75 }, career: 'Labs, Industries' },
      { name: 'Biology', requirements: { biology: 85, chemistry: 75 }, career: 'Research, Healthcare' },
    ],
  },
  {
    category: 'Social Sciences',
    departments: [
      { name: 'Law', requirements: { english: 85, civics: 80 }, career: 'Legal practice, Government' },
      { name: 'Psychology', requirements: { biology: 70, english: 75 }, career: 'Counseling, HR' },
      { name: 'Sociology', requirements: { english: 72, civics: 75 }, career: 'Research, NGOs' },
      { name: 'Political Science', requirements: { english: 78, civics: 82 }, career: 'Government, Diplomacy' },
    ],
  },
];

const mockStudentPerformance = {
  math: 88,
  physics: 82,
  chemistry: 75,
  biology: 70,
  english: 85,
  civics: 78,
};

const Guidance = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCategory, setExpandedCategory] = useState<string | null>('Engineering & Technology');

  const getReadinessLevel = (requirements: Record<string, number>) => {
    const subjects = Object.keys(requirements);
    let totalMatch = 0;
    subjects.forEach((subject) => {
      const required = requirements[subject];
      const actual = mockStudentPerformance[subject as keyof typeof mockStudentPerformance] || 0;
      totalMatch += Math.min((actual / required) * 100, 100);
    });
    const matchPercentage = totalMatch / subjects.length;
    if (matchPercentage >= 95) return { level: 'High', color: 'success', icon: CheckCircle2 };
    if (matchPercentage >= 75) return { level: 'Medium', color: 'warning', icon: AlertCircle };
    return { level: 'Low', color: 'destructive', icon: Info };
  };

  const getMatchScore = (requirements: Record<string, number>) => {
    const subjects = Object.keys(requirements);
    let totalScore = 0;
    subjects.forEach((subject) => {
      const required = requirements[subject];
      const actual = mockStudentPerformance[subject as keyof typeof mockStudentPerformance] || 0;
      totalScore += Math.min((actual / required) * 100, 100);
    });
    return Math.round(totalScore / subjects.length);
  };

  const filteredDepartments = departments.map((cat) => ({
    ...cat,
    departments: cat.departments.filter((dept) =>
      dept.name.toLowerCase().includes(searchQuery.toLowerCase())
    ),
  })).filter((cat) => cat.departments.length > 0);

  return (
    <AppLayout title="University Department Guidance">
      <div className="max-w-3xl mb-8">
        <p className="text-muted-foreground mb-6">
          Explore Ethiopian university departments and find the best match based on academic performance.
        </p>
        <div className="relative max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search departments..."
            className="pl-12 h-12 text-base"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* Performance Summary */}
      <div className="card-elevated p-6 rounded-xl mb-8">
        <h2 className="font-display text-xl font-semibold mb-4">Current Performance Summary</h2>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          {Object.entries(mockStudentPerformance).map(([subject, score]) => (
            <div key={subject} className="text-center">
              <div className={`text-2xl font-bold ${score >= 85 ? 'text-success' : score >= 70 ? 'text-warning' : 'text-destructive'}`}>
                {score}%
              </div>
              <div className="text-sm text-muted-foreground capitalize">{subject}</div>
            </div>
          ))}
        </div>
        <p className="mt-4 text-sm text-muted-foreground">
          * This is sample data. Connect your student account to see personalized recommendations.
        </p>
      </div>

      {/* Departments */}
      <div className="space-y-6">
        {filteredDepartments.map((category) => (
          <div key={category.category} className="card-elevated rounded-xl overflow-hidden">
            <button
              onClick={() => setExpandedCategory(expandedCategory === category.category ? null : category.category)}
              className="w-full flex items-center justify-between p-6 hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-primary/10">
                  <GraduationCap className="h-6 w-6 text-primary" />
                </div>
                <div className="text-left">
                  <h3 className="font-display text-xl font-semibold">{category.category}</h3>
                  <p className="text-sm text-muted-foreground">{category.departments.length} departments</p>
                </div>
              </div>
              <ChevronDown className={`h-5 w-5 text-muted-foreground transition-transform ${expandedCategory === category.category ? 'rotate-180' : ''}`} />
            </button>

            {expandedCategory === category.category && (
              <div className="border-t border-border">
                {category.departments.map((dept) => {
                  const readiness = getReadinessLevel(dept.requirements);
                  const matchScore = getMatchScore(dept.requirements);
                  const ReadinessIcon = readiness.icon;
                  return (
                    <div key={dept.name} className="flex flex-col md:flex-row md:items-center gap-4 p-6 border-b border-border last:border-b-0 hover:bg-muted/30 transition-colors">
                      <div className="flex-1">
                        <h4 className="font-semibold mb-1">{dept.name}</h4>
                        <p className="text-sm text-muted-foreground">{dept.career}</p>
                      </div>
                      <div className="flex flex-wrap items-center gap-4">
                        <div className="flex gap-2">
                          {Object.entries(dept.requirements).map(([subject, min]) => (
                            <span key={subject} className="px-2 py-1 rounded-md bg-muted text-xs font-medium capitalize">
                              {subject}: {min}%
                            </span>
                          ))}
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                            <div className={`h-full rounded-full bg-${readiness.color}`} style={{ width: `${matchScore}%` }} />
                          </div>
                          <span className="text-sm font-medium w-12">{matchScore}%</span>
                        </div>
                        <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border performance-${readiness.level.toLowerCase()}`}>
                          <ReadinessIcon className="h-4 w-4" />
                          <span className="text-sm font-medium">{readiness.level}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Disclaimer */}
      <div className="mt-8 p-6 rounded-xl bg-warning/10 border border-warning/20">
        <div className="flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-warning flex-shrink-0 mt-0.5" />
          <div>
            <h4 className="font-semibold text-warning mb-1">Important Notice</h4>
            <p className="text-sm text-muted-foreground">
              These recommendations are for guidance purposes only. Final university admission depends on official Ethiopian Higher Education Entrance Examination (EHEEE) results and Ministry of Education criteria.
            </p>
          </div>
        </div>
      </div>
    </AppLayout>
  );
};

export default Guidance;
