import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CourseResult } from "@/pages/Results";
import { Calculator, AlertCircle, CheckCircle2 } from "lucide-react";

interface ResultEntryFormProps {
  onSubmit: (result: CourseResult) => void;
}

const WEIGHT_PRESETS = [
  { label: "Standard (10-20-50-20)", test: 10, midExam: 20, finalExam: 50, assignment: 20 },
  { label: "Balanced (20-20-40-20)", test: 20, midExam: 20, finalExam: 40, assignment: 20 },
  { label: "Test Heavy (20-30-40-10)", test: 20, midExam: 30, finalExam: 40, assignment: 10 },
  { label: "Custom", test: 0, midExam: 0, finalExam: 0, assignment: 0 },
];

const ACADEMIC_YEARS = [
  "Grade 9 - 2016 E.C.",
  "Grade 10 - 2017 E.C.",
  "Grade 11 - 2017 E.C.",
  "Grade 12 - 2018 E.C.",
];

const COURSES = [
  "Mathematics",
  "Physics",
  "Chemistry",
  "Biology",
  "English",
  "Amharic",
  "History",
  "Geography",
  "Civics",
  "ICT",
];

export const ResultEntryForm = ({ onSubmit }: ResultEntryFormProps) => {
  const [courseName, setCourseName] = useState("");
  const [academicYear, setAcademicYear] = useState("");
  const [period, setPeriod] = useState<"monthly" | "semester" | "yearly">("semester");
  const [weightPreset, setWeightPreset] = useState("Standard (10-20-50-20)");
  
  const [weights, setWeights] = useState({
    test: 10,
    midExam: 20,
    finalExam: 50,
    assignment: 20,
  });

  const [maxScores, setMaxScores] = useState({
    test: 10,
    midExam: 20,
    finalExam: 50,
    assignment: 20,
    bonus: 5,
  });

  const [scores, setScores] = useState({
    test: 0,
    midExam: 0,
    finalExam: 0,
    assignment: 0,
    bonus: 0,
  });

  const [bonusEnabled, setBonusEnabled] = useState(false);
  const [bonusCap, setBonusCap] = useState(5);

  const totalWeight = weights.test + weights.midExam + weights.finalExam + weights.assignment;
  const isValidWeight = totalWeight === 100;

  // Calculate weighted score
  const calculateWeightedScore = () => {
    const testWeighted = maxScores.test > 0 ? (scores.test / maxScores.test) * weights.test : 0;
    const midWeighted = maxScores.midExam > 0 ? (scores.midExam / maxScores.midExam) * weights.midExam : 0;
    const finalWeighted = maxScores.finalExam > 0 ? (scores.finalExam / maxScores.finalExam) * weights.finalExam : 0;
    const assignmentWeighted = maxScores.assignment > 0 ? (scores.assignment / maxScores.assignment) * weights.assignment : 0;
    
    return testWeighted + midWeighted + finalWeighted + assignmentWeighted;
  };

  const weightedScore = calculateWeightedScore();
  const bonusPoints = bonusEnabled ? Math.min(scores.bonus, bonusCap) : 0;
  const finalResult = Math.min(weightedScore + bonusPoints, 100);

  // Update weights when preset changes
  useEffect(() => {
    const preset = WEIGHT_PRESETS.find((p) => p.label === weightPreset);
    if (preset && preset.label !== "Custom") {
      setWeights({
        test: preset.test,
        midExam: preset.midExam,
        finalExam: preset.finalExam,
        assignment: preset.assignment,
      });
      setMaxScores({
        test: preset.test,
        midExam: preset.midExam,
        finalExam: preset.finalExam,
        assignment: preset.assignment,
        bonus: bonusCap,
      });
    }
  }, [weightPreset, bonusCap]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isValidWeight) {
      return;
    }

    const result: CourseResult = {
      id: Date.now().toString(),
      courseName,
      academicYear,
      period,
      weights,
      scores,
      maxScores,
      bonusEnabled,
      bonusCap,
      weightedScore,
      finalResult,
    };

    onSubmit(result);
    
    // Reset form
    setScores({ test: 0, midExam: 0, finalExam: 0, assignment: 0, bonus: 0 });
    setCourseName("");
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-success";
    if (score >= 75) return "text-primary";
    if (score >= 60) return "text-gold";
    return "text-destructive";
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Course Info */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5 text-primary" />
              Course Information
            </CardTitle>
            <CardDescription>
              Select the course and academic period for result entry
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="course">Course Name</Label>
                <Select value={courseName} onValueChange={setCourseName}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select course" />
                  </SelectTrigger>
                  <SelectContent>
                    {COURSES.map((course) => (
                      <SelectItem key={course} value={course}>
                        {course}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="year">Academic Year</Label>
                <Select value={academicYear} onValueChange={setAcademicYear}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select year" />
                  </SelectTrigger>
                  <SelectContent>
                    {ACADEMIC_YEARS.map((year) => (
                      <SelectItem key={year} value={year}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="period">Entry Period</Label>
                <Select value={period} onValueChange={(v) => setPeriod(v as typeof period)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="semester">Semester</SelectItem>
                    <SelectItem value="yearly">Yearly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="preset">Weight Preset</Label>
                <Select value={weightPreset} onValueChange={setWeightPreset}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {WEIGHT_PRESETS.map((preset) => (
                      <SelectItem key={preset.label} value={preset.label}>
                        {preset.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Weight Validation */}
            {!isValidWeight && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Total weight must equal 100%. Current total: {totalWeight}%
                </AlertDescription>
              </Alert>
            )}
            {isValidWeight && (
              <Alert className="border-success/50 bg-success/10">
                <CheckCircle2 className="h-4 w-4 text-success" />
                <AlertDescription className="text-success">
                  Weight configuration is valid (100%)
                </AlertDescription>
              </Alert>
            )}

            {/* Custom Weights */}
            {weightPreset === "Custom" && (
              <div className="space-y-4">
                <Label>Custom Weights (must total 100%)</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Test %</Label>
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      value={weights.test}
                      onChange={(e) => setWeights({ ...weights, test: Number(e.target.value) })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Mid Exam %</Label>
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      value={weights.midExam}
                      onChange={(e) => setWeights({ ...weights, midExam: Number(e.target.value) })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Final Exam %</Label>
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      value={weights.finalExam}
                      onChange={(e) => setWeights({ ...weights, finalExam: Number(e.target.value) })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Assignment %</Label>
                    <Input
                      type="number"
                      min="0"
                      max="100"
                      value={weights.assignment}
                      onChange={(e) => setWeights({ ...weights, assignment: Number(e.target.value) })}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Bonus Settings */}
            <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
              <div>
                <Label>Enable Bonus Points</Label>
                <p className="text-sm text-muted-foreground">
                  Add optional bonus points capped at maximum
                </p>
              </div>
              <div className="flex items-center gap-4">
                {bonusEnabled && (
                  <div className="flex items-center gap-2">
                    <Label className="text-sm">Max:</Label>
                    <Input
                      type="number"
                      min="1"
                      max="20"
                      value={bonusCap}
                      onChange={(e) => setBonusCap(Number(e.target.value))}
                      className="w-16"
                    />
                  </div>
                )}
                <Switch checked={bonusEnabled} onCheckedChange={setBonusEnabled} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Live Calculation Preview */}
        <Card className="bg-gradient-to-br from-primary/5 to-gold/5 border-primary/20">
          <CardHeader>
            <CardTitle className="text-lg">Live Calculation</CardTitle>
            <CardDescription>See your score as you enter</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center py-4">
              <p className="text-sm text-muted-foreground mb-2">Weighted Score</p>
              <p className={`text-5xl font-bold ${getScoreColor(finalResult)}`}>
                {finalResult.toFixed(1)}%
              </p>
              {bonusEnabled && bonusPoints > 0 && (
                <p className="text-sm text-success mt-2">
                  +{bonusPoints} bonus points
                </p>
              )}
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Test ({weights.test}%)</span>
                <span>{maxScores.test > 0 ? ((scores.test / maxScores.test) * weights.test).toFixed(1) : 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Mid Exam ({weights.midExam}%)</span>
                <span>{maxScores.midExam > 0 ? ((scores.midExam / maxScores.midExam) * weights.midExam).toFixed(1) : 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Final ({weights.finalExam}%)</span>
                <span>{maxScores.finalExam > 0 ? ((scores.finalExam / maxScores.finalExam) * weights.finalExam).toFixed(1) : 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Assignment ({weights.assignment}%)</span>
                <span>{maxScores.assignment > 0 ? ((scores.assignment / maxScores.assignment) * weights.assignment).toFixed(1) : 0}</span>
              </div>
              {bonusEnabled && (
                <div className="flex justify-between text-success">
                  <span>Bonus</span>
                  <span>+{bonusPoints}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Score Entry */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Enter Scores</CardTitle>
            <CardDescription>
              Enter your raw scores for each component (score / max possible)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              {/* Test */}
              <div className="space-y-3">
                <Label className="text-base font-semibold">Test</Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    min="0"
                    max={maxScores.test}
                    value={scores.test}
                    onChange={(e) => setScores({ ...scores, test: Number(e.target.value) })}
                    placeholder="Score"
                  />
                  <span className="text-muted-foreground">/</span>
                  <Input
                    type="number"
                    min="1"
                    value={maxScores.test}
                    onChange={(e) => setMaxScores({ ...maxScores, test: Number(e.target.value) })}
                    className="w-20"
                  />
                </div>
                <p className="text-xs text-muted-foreground">Weight: {weights.test}%</p>
              </div>

              {/* Mid Exam */}
              <div className="space-y-3">
                <Label className="text-base font-semibold">Mid Exam</Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    min="0"
                    max={maxScores.midExam}
                    value={scores.midExam}
                    onChange={(e) => setScores({ ...scores, midExam: Number(e.target.value) })}
                    placeholder="Score"
                  />
                  <span className="text-muted-foreground">/</span>
                  <Input
                    type="number"
                    min="1"
                    value={maxScores.midExam}
                    onChange={(e) => setMaxScores({ ...maxScores, midExam: Number(e.target.value) })}
                    className="w-20"
                  />
                </div>
                <p className="text-xs text-muted-foreground">Weight: {weights.midExam}%</p>
              </div>

              {/* Final Exam */}
              <div className="space-y-3">
                <Label className="text-base font-semibold">Final Exam</Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    min="0"
                    max={maxScores.finalExam}
                    value={scores.finalExam}
                    onChange={(e) => setScores({ ...scores, finalExam: Number(e.target.value) })}
                    placeholder="Score"
                  />
                  <span className="text-muted-foreground">/</span>
                  <Input
                    type="number"
                    min="1"
                    value={maxScores.finalExam}
                    onChange={(e) => setMaxScores({ ...maxScores, finalExam: Number(e.target.value) })}
                    className="w-20"
                  />
                </div>
                <p className="text-xs text-muted-foreground">Weight: {weights.finalExam}%</p>
              </div>

              {/* Assignment */}
              <div className="space-y-3">
                <Label className="text-base font-semibold">Assignment</Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    min="0"
                    max={maxScores.assignment}
                    value={scores.assignment}
                    onChange={(e) => setScores({ ...scores, assignment: Number(e.target.value) })}
                    placeholder="Score"
                  />
                  <span className="text-muted-foreground">/</span>
                  <Input
                    type="number"
                    min="1"
                    value={maxScores.assignment}
                    onChange={(e) => setMaxScores({ ...maxScores, assignment: Number(e.target.value) })}
                    className="w-20"
                  />
                </div>
                <p className="text-xs text-muted-foreground">Weight: {weights.assignment}%</p>
              </div>

              {/* Bonus */}
              <div className="space-y-3">
                <Label className={`text-base font-semibold ${!bonusEnabled ? "text-muted-foreground" : ""}`}>
                  Bonus
                </Label>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    min="0"
                    max={bonusCap}
                    value={scores.bonus}
                    onChange={(e) => setScores({ ...scores, bonus: Number(e.target.value) })}
                    placeholder="Score"
                    disabled={!bonusEnabled}
                  />
                  <span className="text-muted-foreground">/</span>
                  <Input
                    type="number"
                    value={bonusCap}
                    className="w-20"
                    disabled
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  {bonusEnabled ? `Max: ${bonusCap} pts` : "Disabled"}
                </p>
              </div>
            </div>

            <div className="mt-8 flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setScores({ test: 0, midExam: 0, finalExam: 0, assignment: 0, bonus: 0 })}
              >
                Clear Scores
              </Button>
              <Button
                type="submit"
                variant="hero"
                size="lg"
                disabled={!isValidWeight || !courseName || !academicYear}
              >
                Save Result
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </form>
  );
};
