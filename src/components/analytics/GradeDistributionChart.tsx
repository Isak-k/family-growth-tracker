import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const data = [
  { name: 'Excellent (90-100)', value: 8, color: 'hsl(var(--success))' },
  { name: 'Very Good (80-89)', value: 6, color: 'hsl(var(--primary))' },
  { name: 'Good (70-79)', value: 4, color: 'hsl(var(--warning))' },
  { name: 'Satisfactory (60-69)', value: 2, color: 'hsl(var(--accent))' },
  { name: 'Needs Improvement (<60)', value: 1, color: 'hsl(var(--destructive))' },
];

export const GradeDistributionChart = () => {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={100}
            paddingAngle={2}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: 'hsl(var(--card))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '8px',
            }}
            labelStyle={{ color: 'hsl(var(--foreground))' }}
          />
          <Legend
            formatter={(value) => (
              <span style={{ color: 'hsl(var(--foreground))', fontSize: '12px' }}>{value}</span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};
