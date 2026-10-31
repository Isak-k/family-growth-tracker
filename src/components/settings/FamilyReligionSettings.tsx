import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/contexts/LanguageContext';
import { useToast } from '@/hooks/use-toast';

export function FamilyReligionSettings() {
  const { isAdmin, religion, updateProfile } = useAuth();
  const { t } = useLanguage();
  const { toast } = useToast();
  const [choice, setChoice] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => { setChoice(religion || ''); }, [religion]);

  if (!isAdmin) return null;

  const save = async () => {
    if (!choice || saving) return;
    setSaving(true);
    try {
      const { error } = await updateProfile({ religion: choice });
      if (error) throw error;
      toast({ title: t('settings.religionSaved') });
    } catch {
      toast({ title: t('settings.religionError'), variant: 'destructive' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader><CardTitle>{t('settings.familyReligion')}</CardTitle></CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="family-religion">{t('settings.religion')}</Label>
          <Select value={choice} onValueChange={setChoice} disabled={saving}>
            <SelectTrigger id="family-religion" className="w-full"><SelectValue placeholder={t('settings.chooseReligion')} /></SelectTrigger>
            <SelectContent>
              <SelectItem value="islam">{t('settings.islam')}</SelectItem>
              <SelectItem value="christianity">{t('settings.christianity')}</SelectItem>
              <SelectItem value="other">{t('settings.otherReligion')}</SelectItem>
              <SelectItem value="prefer_not">{t('settings.preferNot')}</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <p className="text-sm text-muted-foreground">{t('settings.religionHint')}</p>
        <Button onClick={save} disabled={saving || !choice || choice === (religion || '')}>
          {saving ? t('settings.savingReligion') : t('settings.saveReligion')}
        </Button>
      </CardContent>
    </Card>
  );
}