import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { HistoryEntry, HistoryCategory } from '@/pages/PersonalHistory';

interface HistoryEntryFormProps {
  entry?: HistoryEntry | null;
  onSubmit: (entry: Omit<HistoryEntry, 'id'>) => void;
  onCancel: () => void;
}

const categories: { value: HistoryCategory; label: string }[] = [
  { value: 'biography', label: 'Biography' },
  { value: 'memory', label: 'Memory' },
  { value: 'achievement', label: 'Achievement' },
  { value: 'goal', label: 'Goal' },
  { value: 'friend', label: 'Friend' },
  { value: 'teacher', label: 'Teacher' },
];

const languages = [
  { value: 'en', label: 'English' },
  { value: 'am', label: 'አማርኛ (Amharic)' },
  { value: 'om', label: 'Afaan Oromoo' },
  { value: 'ar', label: 'العربية (Arabic)' },
];

export const HistoryEntryForm = ({ entry, onSubmit, onCancel }: HistoryEntryFormProps) => {
  const [title, setTitle] = useState(entry?.title || '');
  const [content, setContent] = useState(entry?.content || '');
  const [category, setCategory] = useState<HistoryCategory>(entry?.category || 'memory');
  const [date, setDate] = useState(entry?.date || new Date().toISOString().split('T')[0]);
  const [isPrivate, setIsPrivate] = useState(entry?.isPrivate ?? true);
  const [language, setLanguage] = useState(entry?.language || 'en');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      title,
      content,
      category,
      date,
      isPrivate,
      language,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select value={category} onValueChange={(value) => setCategory(value as HistoryCategory)}>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((cat) => (
                <SelectItem key={cat.value} value={cat.value}>
                  {cat.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="language">Language</Label>
          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger>
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent>
              {languages.map((lang) => (
                <SelectItem key={lang.value} value={lang.value}>
                  {lang.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Give your entry a title"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="content">Content</Label>
        <Textarea
          id="content"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your story..."
          rows={6}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="date">Date</Label>
        <Input
          id="date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Switch id="privacy" checked={isPrivate} onCheckedChange={setIsPrivate} />
          <Label htmlFor="privacy" className="cursor-pointer">
            {isPrivate ? 'Secret (only you can see)' : 'Shared with my family'}
          </Label>
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" variant="hero">
          {entry ? 'Save Changes' : 'Add Entry'}
        </Button>
      </div>
    </form>
  );
};
