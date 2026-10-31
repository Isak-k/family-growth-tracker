import { ChevronDown, ChevronRight, Pencil, Plus, Trash2, BookOpen, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { AcademicYear, Course } from '@/pages/Academics';

interface AcademicYearCardProps {
  year: AcademicYear;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onAddCourse: () => void;
  onEditCourse: (course: Course) => void;
  onDeleteCourse: (courseId: string) => void;
}

export const AcademicYearCard = ({
  year,
  isExpanded,
  onToggleExpand,
  onEdit,
  onDelete,
  onAddCourse,
  onEditCourse,
  onDeleteCourse,
}: AcademicYearCardProps) => {
  return (
    <div className="card-elevated rounded-xl overflow-hidden">
      {/* Year Header */}
      <div
        className="flex items-center gap-4 p-4 cursor-pointer hover:bg-muted/50 transition-colors"
        onClick={onToggleExpand}
      >
        <button className="p-1 rounded-lg hover:bg-muted">
          {isExpanded ? (
            <ChevronDown className="h-5 w-5 text-muted-foreground" />
          ) : (
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          )}
        </button>

        <div className="p-3 rounded-xl bg-primary/10">
          <Calendar className="h-6 w-6 text-primary" />
        </div>

        <div className="flex-1">
          <h3 className="font-display font-semibold">{year.name}</h3>
          <p className="text-sm text-muted-foreground">
            {year.courses.length} course{year.courses.length !== 1 ? 's' : ''} •{' '}
            {new Date(year.startDate).toLocaleDateString()} - {new Date(year.endDate).toLocaleDateString()}
          </p>
        </div>

        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
          <Button variant="ghost" size="sm" onClick={onEdit}>
            <Pencil className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={onDelete} className="text-destructive hover:text-destructive">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Courses List */}
      {isExpanded && (
        <div className="border-t border-border">
          <div className="p-4 space-y-3">
            {year.courses.map((course) => (
              <div
                key={course.id}
                className="flex items-center gap-4 p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors"
              >
                <div className="p-2 rounded-lg bg-secondary/20">
                  <BookOpen className="h-5 w-5 text-secondary-foreground" />
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{course.name}</span>
                    <Badge variant="secondary" className="text-xs">
                      Max: {course.maxScore}
                    </Badge>
                    {course.gradingConfig.bonusEnabled && (
                      <Badge variant="outline" className="text-xs text-success border-success">
                        +{course.gradingConfig.bonusMax} Bonus
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Weights: Test {course.gradingConfig.test}% • Mid {course.gradingConfig.mid}% • Final{' '}
                    {course.gradingConfig.final}% • Assignment {course.gradingConfig.assignment}%
                  </p>
                </div>

                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="sm" onClick={() => onEditCourse(course)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDeleteCourse(course.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}

            {year.courses.length === 0 && (
              <div className="text-center py-6 text-muted-foreground">
                <BookOpen className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No courses added yet</p>
              </div>
            )}

            <Button variant="outline" className="w-full mt-2" onClick={onAddCourse}>
              <Plus className="h-4 w-4 mr-2" />
              Add Course
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
