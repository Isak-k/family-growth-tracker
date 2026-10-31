import { useCallback, useEffect, useState } from "react";
import { ResultEntryForm } from "@/components/results/ResultEntryForm";
import { ResultsSummary } from "@/components/results/ResultsSummary";
import { CourseResults } from "@/components/results/CourseResults";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AppLayout } from "@/components/AppLayout";
import { useLanguage } from "@/contexts/LanguageContext";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Calculator, BookOpen, TrendingUp, Loader2 } from "lucide-react";

export interface CourseResult {
  id: string;
  courseName: string;
  academicYear: string;
  period: "monthly" | "semester" | "yearly";
  weights: { test: number; midExam: number; finalExam: number; assignment: number };
  scores: { test: number; midExam: number; finalExam: number; assignment: number; bonus: number };
  maxScores: { test: number; midExam: number; finalExam: number; assignment: number; bonus: number };
  bonusEnabled: boolean;
  bonusCap: number;
  weightedScore: number;
  finalResult: number;
}

type GradeRow = { id: string; subject: string; grade: number; term: string; academic_year: string; notes: string | null };

const toResult = (r: GradeRow): CourseResult => {
  let d: Partial<CourseResult> = {};
  try { d = r.notes ? JSON.parse(r.notes) : {}; } catch { d = {}; }
  const zero = { test: 0, midExam: 0, finalExam: 0, assignment: 0 };
  return {
    id: r.id, courseName: r.subject, academicYear: r.academic_year,
    period: (["monthly", "semester", "yearly"].includes(r.term) ? r.term : "semester") as CourseResult["period"],
    weights: d.weights ?? zero, scores: d.scores ?? { ...zero, bonus: 0 }, maxScores: d.maxScores ?? { ...zero, bonus: 0 },
    bonusEnabled: d.bonusEnabled ?? false, bonusCap: d.bonusCap ?? 0,
    weightedScore: d.weightedScore ?? Number(r.grade), finalResult: Number(r.grade),
  };
};

const Results = () => {
  const { t } = useLanguage();
  const { user, isAdmin, loading: authLoading } = useAuth();
  const [children, setChildren] = useState<{ id: string; name: string }[]>([]);
  const [selected, setSelected] = useState<string>("");
  const [results, setResults] = useState<CourseResult[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user || authLoading) return;
    if (!isAdmin) { setSelected(user.id); return; }
    (async () => {
      const { data: rels } = await supabase.from("parent_child_relationships").select("child_id").eq("parent_id", user.id);
      const ids = (rels || []).map((r) => r.child_id);
      if (!ids.length) { setChildren([]); setLoading(false); return; }
      const { data: profs } = await supabase.from("profiles").select("user_id, full_name, email").in("user_id", ids);
      const list = ids.map((id) => {
        const p = profs?.find((x) => x.user_id === id);
        return { id, name: p?.full_name || p?.email || "Child" };
      });
      setChildren(list);
      setSelected((s) => s || list[0].id);
    })();
  }, [user, isAdmin, authLoading]);

  const load = useCallback(async () => {
    if (!selected) return;
    setLoading(true);
    const { data, error } = await supabase.from("student_grades")
      .select("id, subject, grade, term, academic_year, notes")
      .eq("student_id", selected).order("grade_date", { ascending: false });
    if (error) toast.error("Could not load results");
    setResults((data || []).map(toResult));
    setLoading(false);
  }, [selected]);

  useEffect(() => { load(); }, [load]);

  const handleAddResult = async (r: CourseResult) => {
    if (!selected) { toast.error(isAdmin ? "Add a child account first" : "Not signed in"); return; }
    const { error } = await supabase.from("student_grades").insert({
      student_id: selected, subject: r.courseName, grade: r.finalResult, max_grade: 100,
      term: r.period, academic_year: r.academicYear || "—",
      notes: JSON.stringify({ weights: r.weights, scores: r.scores, maxScores: r.maxScores, bonusEnabled: r.bonusEnabled, bonusCap: r.bonusCap, weightedScore: r.weightedScore }),
    });
    if (error) { toast.error("Could not save result: " + error.message); return; }
    toast.success("Result saved");
    load();
  };

  const handleDeleteResult = async (id: string) => {
    const { error } = await supabase.from("student_grades").delete().eq("id", id);
    if (error) { toast.error("Could not delete result"); return; }
    setResults((rs) => rs.filter((r) => r.id !== id));
  };

  const overallAverage = results.length ? results.reduce((s, r) => s + r.finalResult, 0) / results.length : 0;

  return (
    <AppLayout title={t("results") || "Student Results"}>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <p className="text-muted-foreground">Enter scores and track performance with weighted calculations</p>
        {isAdmin && children.length > 0 && (
          <Select value={selected} onValueChange={setSelected}>
            <SelectTrigger className="w-56"><SelectValue placeholder="Choose child" /></SelectTrigger>
            <SelectContent>{children.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
          </Select>
        )}
      </div>

      {isAdmin && !loading && children.length === 0 ? (
        <div className="bg-card border border-border rounded-xl p-8 text-center text-muted-foreground">
          No child accounts yet. Add a child with a login on the Students page first.
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-card border border-border rounded-xl p-6 flex items-center gap-4">
              <div className="p-3 rounded-lg bg-primary/10"><BookOpen className="h-6 w-6 text-primary" /></div>
              <div><p className="text-sm text-muted-foreground">Total Courses</p><p className="text-2xl font-bold text-foreground">{results.length}</p></div>
            </div>
            <div className="bg-card border border-border rounded-xl p-6 flex items-center gap-4">
              <div className="p-3 rounded-lg bg-secondary/10"><Calculator className="h-6 w-6 text-secondary" /></div>
              <div><p className="text-sm text-muted-foreground">Overall Average</p><p className="text-2xl font-bold text-foreground">{overallAverage.toFixed(1)}%</p></div>
            </div>
            <div className="bg-card border border-border rounded-xl p-6 flex items-center gap-4">
              <div className="p-3 rounded-lg bg-success/10"><TrendingUp className="h-6 w-6 text-success" /></div>
              <div><p className="text-sm text-muted-foreground">Performance</p><p className="text-2xl font-bold text-foreground">
                {results.length === 0 ? "—" : overallAverage >= 90 ? "Excellent" : overallAverage >= 75 ? "Good" : overallAverage >= 60 ? "Average" : "Needs Work"}
              </p></div>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center py-12"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
          ) : (
            <Tabs defaultValue="entry" className="space-y-6">
              <TabsList className="bg-muted/50 p-1">
                <TabsTrigger value="entry">Enter Results</TabsTrigger>
                <TabsTrigger value="courses">Course Results</TabsTrigger>
                <TabsTrigger value="summary">Summary</TabsTrigger>
              </TabsList>
              <TabsContent value="entry"><ResultEntryForm onSubmit={handleAddResult} /></TabsContent>
              <TabsContent value="courses"><CourseResults results={results} onDelete={handleDeleteResult} /></TabsContent>
              <TabsContent value="summary"><ResultsSummary results={results} /></TabsContent>
            </Tabs>
          )}
        </>
      )}
    </AppLayout>
  );
};

export default Results;
