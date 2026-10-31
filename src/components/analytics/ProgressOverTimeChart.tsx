import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

const data = [
  { month: 'Sep', average: 78, target: 80 },
  { month: 'Oct', average: 82, target: 80 },
  { month: 'Nov', average: 79, target: 80 },
  { month: 'Dec', average: 85, target: 80 },
  { month: 'Jan', average: 83, target: 80 },
  { month: 'Feb', average: 88, target: 80 },
  { month: 'Mar', average: 86, target: 80 },
  { month: 'Apr', average: 90, target: 80 },
  { month: 'May', average: 87, target: 80 },
  { month: 'Jun', average: 92, target: 80 },
];

export const ProgressOverTimeChart = () => {
  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
          <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
          <YAxis domain={[60, 100]} stroke="hsl(var(--muted-foreground))" fontSize={12} />
          <Tooltip
            contentStyle={{
              backgroundColor: 'hsl(var(--card))',
              border: '1px solid hsl(var(--border))',
              borderRadius: '8px',
            }}
            labelStyle={{ color: 'hsl(var(--foreground))' }}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="average"
            stroke="hsl(var(--primary))"
            strokeWidth={3}
            dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2 }}
            activeDot={{ r: 6, fill: 'hsl(var(--primary))' }}
            name="Average Score"
          />
          <Line
            type="monotone"
            dataKey="target"
            stroke="hsl(var(--muted-foreground))"
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={false}
            name="Target"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
