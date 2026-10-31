import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';

const data = [
  { subject: 'Mathematics', score: 92, maxScore: 100 },
  { subject: 'Physics', score: 88, maxScore: 100 },
  { subject: 'Chemistry', score: 85, maxScore: 100 },
  { subject: 'Biology', score: 90, maxScore: 100 },
  { subject: 'English', score: 78, maxScore: 100 },
  { subject: 'History', score: 82, maxScore: 100 },
  { subject: 'Geography', score: 75, maxScore: 100 },
  { subject: 'Amharic', score: 95, maxScore: 100 },
];

const getBarColor = (score: number) => {
  if (score >= 90) return 'hsl(var(--success))';
  if (score >= 75) return 'hsl(var(--warning))';
  return 'hsl(var(--destructive))';
};

export const CoursePerformanceChart = () => {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 60, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis type="number" domain={[0, 100]} stroke="hsl(var(--muted-foreground))" fontSize={12} />
          <YAxis
            dataKey="subject"
            type="category"
            stroke="hsl(var(--muted-foreground))"
            fontSize={12}
            width={80}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'hsl(var(--card))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '8px',
            }}
            labelStyle={{ color: 'hsl(var(--foreground))' }}
          />
          <Bar dataKey="score" radius={[0, 4, 4, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getBarColor(entry.score)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
