import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CourseResult } from "@/pages/Results";
import { Trophy, Target, TrendingUp, Award } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

interface ResultsSummaryProps {
  results: CourseResult[];
}

export const ResultsSummary = ({ results }: ResultsSummaryProps) => {
  if (results.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <Trophy className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">No Summary Available</h3>
          <p className="text-muted-foreground">
            Add course results to see your performance summary.
          </p>
        </CardContent>
      </Card>
    );
  }

  const overallAverage = results.reduce((sum, r) => sum + r.finalResult, 0) / results.length;
  const highestScore = Math.max(...results.map((r) => r.finalResult));
  const lowestScore = Math.min(...results.map((r) => r.finalResult));
  const bestCourse = results.find((r) => r.finalResult === highestScore);
  const weakestCourse = results.find((r) => r.finalResult === lowestScore);

  const chartData = results.map((r) => ({
    name: r.courseName.length > 8 ? r.courseName.substring(0, 8) + "..." : r.courseName,
    fullName: r.courseName,
    score: r.finalResult,
  }));

  const getBarColor = (score: number) => {
    if (score >= 85) return "hsl(var(--success))";
    if (score >= 70) return "hsl(var(--primary))";
    if (score >= 55) return "hsl(var(--gold))";
    return "hsl(var(--destructive))";
  };

  const getGradeDistribution = () => {
    const distribution = { A: 0, B: 0, C: 0, F: 0 };
    results.forEach((r) => {
      if (r.finalResult >= 80) distribution.A++;
      else if (r.finalResult >= 65) distribution.B++;
      else if (r.finalResult >= 50) distribution.C++;
      else distribution.F++;
    });
    return distribution;
  };

  const gradeDistribution = getGradeDistribution();

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gradient-to-br from-primary/10 to-primary/5">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-primary/20">
                <Target className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Overall Average</p>
                <p className="text-3xl font-bold text-primary">{overallAverage.toFixed(1)}%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-success/10 to-success/5">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-success/20">
                <Trophy className="h-6 w-6 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Highest Score</p>
                <p className="text-3xl font-bold text-success">{highestScore.toFixed(1)}%</p>
                <p className="text-xs text-muted-foreground">{bestCourse?.courseName}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-gold/10 to-gold/5">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-gold/20">
                <TrendingUp className="h-6 w-6 text-gold" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Lowest Score</p>
                <p className="text-3xl font-bold text-gold">{lowestScore.toFixed(1)}%</p>
                <p className="text-xs text-muted-foreground">{weakestCourse?.courseName}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-secondary/30 to-secondary/10">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-secondary">
                <Award className="h-6 w-6 text-secondary-foreground" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Courses</p>
                <p className="text-3xl font-bold text-foreground">{results.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Course Performance Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Course Performance</CardTitle>
            <CardDescription>Final results by course</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                  <XAxis type="number" domain={[0, 100]} />
                  <YAxis dataKey="name" type="category" width={80} tick={{ fontSize: 12 }} />
                  <Tooltip
                    formatter={(value: number) => [`${value.toFixed(1)}%`, "Score"]}
                    labelFormatter={(label) => chartData.find((d) => d.name === label)?.fullName || label}
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                  />
                  <Bar dataKey="score" radius={[0, 4, 4, 0]}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={getBarColor(entry.score)} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Grade Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Grade Distribution</CardTitle>
            <CardDescription>Breakdown by grade tier</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">A Grade (80%+)</span>
                  <span className="text-muted-foreground">{gradeDistribution.A} courses</span>
                </div>
                <Progress
                  value={(gradeDistribution.A / results.length) * 100}
                  className="h-3 bg-success/20"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">B Grade (65-79%)</span>
                  <span className="text-muted-foreground">{gradeDistribution.B} courses</span>
                </div>
                <Progress
                  value={(gradeDistribution.B / results.length) * 100}
                  className="h-3 bg-primary/20"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">C Grade (50-64%)</span>
                  <span className="text-muted-foreground">{gradeDistribution.C} courses</span>
                </div>
                <Progress
                  value={(gradeDistribution.C / results.length) * 100}
                  className="h-3 bg-gold/20"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">F Grade (&lt;50%)</span>
                  <span className="text-muted-foreground">{gradeDistribution.F} courses</span>
                </div>
                <Progress
                  value={(gradeDistribution.F / results.length) * 100}
                  className="h-3 bg-destructive/20"
                />
              </div>
            </div>

            <div className="pt-4 border-t">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Performance Level</span>
                <span className="font-semibold text-primary">
                  {overallAverage >= 85
                    ? "🏆 Excellent"
                    : overallAverage >= 70
                    ? "👍 Good"
                    : overallAverage >= 55
                    ? "📈 Average"
                    : "⚠️ Needs Improvement"}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Strengths & Weaknesses */}
      <Card>
        <CardHeader>
          <CardTitle>Strengths & Areas for Improvement</CardTitle>
          <CardDescription>Based on your current results</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-semibold text-success flex items-center gap-2">
                <Trophy className="h-4 w-4" /> Top Performing Subjects
              </h4>
              {results
                .sort((a, b) => b.finalResult - a.finalResult)
                .slice(0, 3)
                .map((r, i) => (
                  <div key={r.id} className="flex items-center justify-between p-3 bg-success/10 rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="text-lg font-bold text-success">{i + 1}</span>
                      <span className="font-medium">{r.courseName}</span>
                    </div>
                    <span className="font-semibold text-success">{r.finalResult.toFixed(1)}%</span>
                  </div>
                ))}
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold text-gold flex items-center gap-2">
                <Target className="h-4 w-4" /> Areas to Focus On
              </h4>
              {results
                .sort((a, b) => a.finalResult - b.finalResult)
                .slice(0, 3)
                .map((r, i) => (
                  <div key={r.id} className="flex items-center justify-between p-3 bg-gold/10 rounded-lg">
                    <div className="flex items-center gap-3">
                      <span className="text-lg font-bold text-gold">{i + 1}</span>
                      <span className="font-medium">{r.courseName}</span>
                    </div>
                    <span className="font-semibold text-gold">{r.finalResult.toFixed(1)}%</span>
                  </div>
                ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
