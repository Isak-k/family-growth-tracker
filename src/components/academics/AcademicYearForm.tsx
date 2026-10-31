import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { AcademicYear } from '@/pages/Academics';

interface AcademicYearFormProps {
  initialData?: AcademicYear | null;
  onSave: (year: Omit<AcademicYear, 'id' | 'courses'>) => void;
  onCancel: () => void;
}

const grades = [
  'Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6',
  'Grade 7', 'Grade 8', 'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12',
];

const ethiopianYears = ['2015', '2016', '2017', '2018', '2019', '2020'];

export const AcademicYearForm = ({ initialData, onSave, onCancel }: AcademicYearFormProps) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    grade: initialData?.grade || 'Grade 10',
    year: initialData?.year || '2017',
    startDate: initialData?.startDate || '',
    endDate: initialData?.endDate || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const name = formData.name || `${formData.grade} - ${formData.year} E.C.`;
    
    onSave({
      name,
      grade: formData.grade,
      year: formData.year,
      startDate: formData.startDate,
      endDate: formData.endDate,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="grade">Grade Level</Label>
        <Select
          value={formData.grade}
          onValueChange={(value) => setFormData({ ...formData, grade: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select grade" />
          </SelectTrigger>
          <SelectContent>
            {grades.map((grade) => (
              <SelectItem key={grade} value={grade}>
                {grade}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="year">Ethiopian Year (E.C.)</Label>
        <Select
          value={formData.year}
          onValueChange={(value) => setFormData({ ...formData, year: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select year" />
          </SelectTrigger>
          <SelectContent>
            {ethiopianYears.map((year) => (
              <SelectItem key={year} value={year}>
                {year} E.C.
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="name">Custom Name (Optional)</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder={`${formData.grade} - ${formData.year} E.C.`}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="startDate">Start Date</Label>
          <Input
            id="startDate"
            type="date"
            value={formData.startDate}
            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="endDate">End Date</Label>
          <Input
            id="endDate"
            type="date"
            value={formData.endDate}
            onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
            required
          />
        </div>
      </div>

      <div className="flex gap-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
          Cancel
        </Button>
        <Button type="submit" variant="hero" className="flex-1">
          {initialData ? 'Update' : 'Create'}
        </Button>
      </div>
    </form>
  );
};
