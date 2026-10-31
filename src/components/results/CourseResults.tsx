import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CourseResult } from "@/pages/Results";
import { Trash2, BookOpen, Calendar, Clock } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface CourseResultsProps {
  results: CourseResult[];
  onDelete: (id: string) => void;
}

export const CourseResults = ({ results, onDelete }: CourseResultsProps) => {
  const getGradeLabel = (score: number) => {
    if (score >= 90) return { label: "A+", color: "bg-success text-success-foreground" };
    if (score >= 85) return { label: "A", color: "bg-success text-success-foreground" };
    if (score >= 80) return { label: "A-", color: "bg-success/80 text-success-foreground" };
    if (score >= 75) return { label: "B+", color: "bg-primary text-primary-foreground" };
    if (score >= 70) return { label: "B", color: "bg-primary text-primary-foreground" };
    if (score >= 65) return { label: "B-", color: "bg-primary/80 text-primary-foreground" };
    if (score >= 60) return { label: "C+", color: "bg-gold text-gold-foreground" };
    if (score >= 55) return { label: "C", color: "bg-gold text-gold-foreground" };
    if (score >= 50) return { label: "C-", color: "bg-gold/80 text-gold-foreground" };
    return { label: "F", color: "bg-destructive text-destructive-foreground" };
  };

  const getPeriodLabel = (period: string) => {
    switch (period) {
      case "monthly": return "Monthly";
      case "semester": return "Semester";
      case "yearly": return "Yearly";
      default: return period;
    }
  };

  if (results.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">No Results Yet</h3>
          <p className="text-muted-foreground">
            Start by entering your course results in the "Enter Results" tab.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">
          All Course Results ({results.length})
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {results.map((result) => {
          const grade = getGradeLabel(result.finalResult);
          
          return (
            <Card key={result.id} className="relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-primary to-gold" />
              
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-xl">{result.courseName}</CardTitle>
                    <CardDescription className="flex items-center gap-2 mt-1">
                      <Calendar className="h-3 w-3" />
                      {result.academicYear}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={grade.color}>{grade.label}</Badge>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Result?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will permanently delete the result for {result.courseName}. This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => onDelete(result.id)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  {getPeriodLabel(result.period)}
                </div>

                {/* Score Breakdown */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      Test ({result.weights.test}%)
                    </span>
                    <span className="text-sm font-medium">
                      {result.scores.test}/{result.maxScores.test}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      Mid Exam ({result.weights.midExam}%)
                    </span>
                    <span className="text-sm font-medium">
                      {result.scores.midExam}/{result.maxScores.midExam}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      Final Exam ({result.weights.finalExam}%)
                    </span>
                    <span className="text-sm font-medium">
                      {result.scores.finalExam}/{result.maxScores.finalExam}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      Assignment ({result.weights.assignment}%)
                    </span>
                    <span className="text-sm font-medium">
                      {result.scores.assignment}/{result.maxScores.assignment}
                    </span>
                  </div>
                  {result.bonusEnabled && (
                    <div className="flex justify-between items-center text-success">
                      <span className="text-sm">Bonus</span>
                      <span className="text-sm font-medium">
                        +{Math.min(result.scores.bonus, result.bonusCap)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Final Score */}
                <div className="pt-3 border-t">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-semibold">Final Result</span>
                    <span className="text-2xl font-bold text-primary">
                      {result.finalResult.toFixed(1)}%
                    </span>
                  </div>
                  <Progress value={result.finalResult} className="h-2" />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};
