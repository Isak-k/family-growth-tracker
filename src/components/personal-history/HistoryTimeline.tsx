import { format } from 'date-fns';
import { Lock, Unlock, Edit3, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { HistoryEntry, HistoryCategory } from '@/pages/PersonalHistory';

interface HistoryTimelineProps {
  entries: HistoryEntry[];
  onEdit: (entry: HistoryEntry) => void;
  onDelete: (id: string) => void;
  onTogglePrivacy: (id: string) => void;
  categoryIcons: Record<HistoryCategory, React.ElementType>;
  categoryLabels: Record<HistoryCategory, string>;
  readOnly?: boolean;
}

export const HistoryTimeline = ({
  entries,
  onEdit,
  onDelete,
  onTogglePrivacy,
  categoryIcons,
  categoryLabels,
  readOnly,
}: HistoryTimelineProps) => {
  if (entries.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
          <Edit3 className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="font-display text-xl font-semibold mb-2">No entries yet</h3>
        <p className="text-muted-foreground">Start writing your personal history</p>
      </div>
    );
  }

  // Sort entries by date (newest first)
  const sortedEntries = [...entries].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="relative">
      {/* Timeline line */}
      <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-border hidden md:block" />

      <div className="space-y-6">
        {sortedEntries.map((entry) => {
          const Icon = categoryIcons[entry.category];
          return (
            <div key={entry.id} className="relative flex gap-6">
              {/* Timeline dot */}
              <div className="hidden md:flex items-start">
                <div className="w-12 h-12 rounded-full bg-primary/10 border-4 border-background flex items-center justify-center z-10">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
              </div>

              {/* Content card */}
              <div className="flex-1 card-elevated p-6 group">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex items-center gap-3 flex-wrap">
                    <Badge variant="secondary" className="rounded-full">
                      {categoryLabels[entry.category]}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {format(new Date(entry.date), 'MMMM d, yyyy')}
                    </span>
                    {entry.isPrivate ? (
                      <span className="flex items-center gap-1 text-xs text-warning">
                        <Lock className="h-3 w-3" />
                        Private
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-xs text-success">
                        <Unlock className="h-3 w-3" />
                        Shared
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  {!readOnly && <div className="flex items-center gap-1 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => onTogglePrivacy(entry.id)}
                      title={entry.isPrivate ? 'Make shared' : 'Make private'}
                    >
                      {entry.isPrivate ? (
                        <Unlock className="h-4 w-4" />
                      ) : (
                        <Lock className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => onEdit(entry)}
                    >
                      <Edit3 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      onClick={() => onDelete(entry.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>}
                </div>

                <h3 className="font-display text-lg font-semibold mb-2">{entry.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{entry.content}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
