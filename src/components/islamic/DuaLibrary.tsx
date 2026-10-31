import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RECOMMENDED_DUAS, type AgeGroup } from '@/data/islamicLearningData';

interface DuaLibraryProps {
  ageGroup: AgeGroup | null;
}

export const DuaLibrary = ({ ageGroup }: DuaLibraryProps) => {
  const allDuas = ageGroup
    ? RECOMMENDED_DUAS.filter(g => g.ageGroup === ageGroup)
    : RECOMMENDED_DUAS;

  if (allDuas.length === 0 || allDuas.every(g => g.duas.length === 0)) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <p className="text-4xl mb-3">🤲</p>
        <p className="font-medium">No duas found for this age group</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {allDuas.map(group => (
        <div key={group.ageGroup}>
          {!ageGroup && (
            <h3 className="font-display font-semibold text-lg mb-3">
              Age {group.ageGroup}
            </h3>
          )}
          <div className="grid gap-3 md:grid-cols-2">
            {group.duas.map((dua, idx) => (
              <Card key={idx} className="overflow-hidden hover:shadow-md transition-shadow">
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold text-sm">{dua.title}</h4>
                    <Badge variant="secondary" className="text-xs capitalize">{dua.category}</Badge>
                  </div>
                  <p className="text-right text-xl font-arabic leading-loose text-foreground" dir="rtl">
                    {dua.arabic}
                  </p>
                  <p className="text-sm text-muted-foreground italic">{dua.translation}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
