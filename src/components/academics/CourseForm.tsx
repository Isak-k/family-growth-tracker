import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { AlertCircle, CheckCircle } from 'lucide-react';
import type { Course, GradingConfig } from '@/pages/Academics';

interface CourseFormProps {
  initialData?: Course | null;
  onSave: (course: Omit<Course, 'id'>) => void;
  onCancel: () => void;
}

const weightPresets = [
  { name: 'Standard (10-20-50-20)', test: 10, mid: 20, final: 50, assignment: 20 },
  { name: 'Balanced (15-25-40-20)', test: 15, mid: 25, final: 40, assignment: 20 },
  { name: 'Project Focus (10-20-40-30)', test: 10, mid: 20, final: 40, assignment: 30 },
  { name: 'Exam Heavy (10-20-60-10)', test: 10, mid: 20, final: 60, assignment: 10 },
  { name: 'Custom', test: 0, mid: 0, final: 0, assignment: 0 },
];

const courseOptions = [
  'Mathematics', 'Physics', 'Chemistry', 'Biology', 'English',
  'Amharic', 'Geography', 'History', 'Civics', 'Economics',
  'ICT', 'Physical Education', 'Art', 'Music', 'Other',
];

export const CourseForm = ({ initialData, onSave, onCancel }: CourseFormProps) => {
  const [formData, setFormData] = useState({
    name: initialData?.name || '',
    customName: '',
    maxScore: initialData?.maxScore || 100,
  });

  const [gradingConfig, setGradingConfig] = useState<GradingConfig>(
    initialData?.gradingConfig || {
      test: 10,
      mid: 20,
      final: 50,
      assignment: 20,
      bonusEnabled: false,
      bonusMax: 0,
    }
  );

  const [selectedPreset, setSelectedPreset] = useState('Standard (10-20-50-20)');

  const totalWeight = gradingConfig.test + gradingConfig.mid + gradingConfig.final + gradingConfig.assignment;
  const isValidWeight = totalWeight === 100;

  const handlePresetChange = (presetName: string) => {
    setSelectedPreset(presetName);
    const preset = weightPresets.find(p => p.name === presetName);
    if (preset && presetName !== 'Custom') {
      setGradingConfig(prev => ({
        ...prev,
        test: preset.test,
        mid: preset.mid,
        final: preset.final,
        assignment: preset.assignment,
      }));
    }
  };

  const handleWeightChange = (field: keyof GradingConfig, value: number) => {
    setGradingConfig(prev => ({ ...prev, [field]: value }));
    setSelectedPreset('Custom');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isValidWeight) return;

    const courseName = formData.name === 'Other' ? formData.customName : formData.name;
    
    onSave({
      name: courseName,
      maxScore: formData.maxScore,
      gradingConfig,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Course Info */}
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="course">Course Name</Label>
          <Select
            value={formData.name}
            onValueChange={(value) => setFormData({ ...formData, name: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select course" />
            </SelectTrigger>
            <SelectContent>
              {courseOptions.map((course) => (
                <SelectItem key={course} value={course}>
                  {course}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {formData.name === 'Other' && (
          <div className="space-y-2">
            <Label htmlFor="customName">Custom Course Name</Label>
            <Input
              id="customName"
              value={formData.customName}
              onChange={(e) => setFormData({ ...formData, customName: e.target.value })}
              placeholder="Enter course name"
              required
            />
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="maxScore">Maximum Score</Label>
          <Input
            id="maxScore"
            type="number"
            min={1}
            max={200}
            value={formData.maxScore}
            onChange={(e) => setFormData({ ...formData, maxScore: parseInt(e.target.value) || 100 })}
          />
        </div>
      </div>

      {/* Grading Configuration */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">Grading Weights</h3>
          <div className={`flex items-center gap-1 text-sm ${isValidWeight ? 'text-success' : 'text-destructive'}`}>
            {isValidWeight ? (
              <CheckCircle className="h-4 w-4" />
            ) : (
              <AlertCircle className="h-4 w-4" />
            )}
            <span>Total: {totalWeight}%</span>
          </div>
        </div>

        <div className="space-y-2">
          <Label>Weight Preset</Label>
          <Select value={selectedPreset} onValueChange={handlePresetChange}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {weightPresets.map((preset) => (
                <SelectItem key={preset.name} value={preset.name}>
                  {preset.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="test">Test Weight (%)</Label>
            <Input
              id="test"
              type="number"
              min={0}
              max={100}
              value={gradingConfig.test}
              onChange={(e) => handleWeightChange('test', parseInt(e.target.value) || 0)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="mid">Mid Exam Weight (%)</Label>
            <Input
              id="mid"
              type="number"
              min={0}
              max={100}
              value={gradingConfig.mid}
              onChange={(e) => handleWeightChange('mid', parseInt(e.target.value) || 0)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="final">Final Exam Weight (%)</Label>
            <Input
              id="final"
              type="number"
              min={0}
              max={100}
              value={gradingConfig.final}
              onChange={(e) => handleWeightChange('final', parseInt(e.target.value) || 0)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="assignment">Assignment Weight (%)</Label>
            <Input
              id="assignment"
              type="number"
              min={0}
              max={100}
              value={gradingConfig.assignment}
              onChange={(e) => handleWeightChange('assignment', parseInt(e.target.value) || 0)}
            />
          </div>
        </div>

        {/* Bonus Configuration */}
        <div className="p-4 rounded-xl bg-muted/50 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="bonusEnabled">Enable Bonus Points</Label>
              <p className="text-sm text-muted-foreground">Allow extra credit for this course</p>
            </div>
            <Switch
              id="bonusEnabled"
              checked={gradingConfig.bonusEnabled}
              onCheckedChange={(checked) =>
                setGradingConfig(prev => ({ ...prev, bonusEnabled: checked, bonusMax: checked ? 5 : 0 }))
              }
            />
          </div>

          {gradingConfig.bonusEnabled && (
            <div className="space-y-2">
              <Label htmlFor="bonusMax">Maximum Bonus Points</Label>
              <Input
                id="bonusMax"
                type="number"
                min={1}
                max={20}
                value={gradingConfig.bonusMax}
                onChange={(e) =>
                  setGradingConfig(prev => ({ ...prev, bonusMax: parseInt(e.target.value) || 0 }))
                }
              />
            </div>
          )}
        </div>
      </div>

      {!isValidWeight && (
        <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
          Weight percentages must add up to exactly 100%. Currently at {totalWeight}%.
        </div>
      )}

      <div className="flex gap-3 pt-4">
        <Button type="button" variant="outline" onClick={onCancel} className="flex-1">
          Cancel
        </Button>
        <Button type="submit" variant="hero" className="flex-1" disabled={!isValidWeight || !formData.name}>
          {initialData ? 'Update Course' : 'Add Course'}
        </Button>
      </div>
    </form>
  );
};
