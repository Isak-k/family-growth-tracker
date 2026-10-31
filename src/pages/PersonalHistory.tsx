import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import {
  Plus,
  Heart,
  Users,
  Award,
  Target,
  BookHeart,
  User,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AppLayout } from '@/components/AppLayout';
import { useLanguage } from '@/contexts/LanguageContext';
import { HistoryTimeline } from '@/components/personal-history/HistoryTimeline';
import { HistoryEntryForm } from '@/components/personal-history/HistoryEntryForm';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

export type HistoryCategory = 'biography' | 'memory' | 'achievement' | 'goal' | 'friend' | 'teacher';

export interface HistoryEntry {
  id: string;
  title: string;
  content: string;
  category: HistoryCategory;
  date: string;
  isPrivate: boolean;
  language: string;
}

const categoryIcons: Record<HistoryCategory, React.ElementType> = {
  biography: User, memory: Heart, achievement: Award, goal: Target, friend: Users, teacher: BookHeart,
};

const categoryLabels: Record<HistoryCategory, string> = {
  biography: 'Biography', memory: 'Memories', achievement: 'Achievements', goal: 'Goals', friend: 'Friends', teacher: 'Teachers',
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const fromRow = (r: any): HistoryEntry => ({
  id: r.id, title: r.title, content: r.content, category: r.category,
  date: r.entry_date, isPrivate: r.is_private, language: r.language,
});

const toRow = (e: Omit<HistoryEntry, 'id'>) => ({
  title: e.title, content: e.content, category: e.category,
  entry_date: e.date, is_private: e.isPrivate, language: e.language,
});

const PersonalHistory = () => {
  const { t } = useLanguage();
  const { user, isAdmin } = useAuth();
  const { toast } = useToast();
  const [entries, setEntries] = useState<HistoryEntry[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<HistoryEntry | null>(null);
  const [activeTab, setActiveTab] = useState<string>('all');

  const load = useCallback(async () => {
    if (!user) return;
    let q = supabase.from('personal_history').select('*').order('entry_date', { ascending: false });
    // Parents only receive children's shared entries (enforced by database rules)
    q = isAdmin ? q.neq('user_id', user.id) : q.eq('user_id', user.id);
    const { data, error } = await q;
    if (error) toast({ title: 'Error', description: error.message, variant: 'destructive' });
    else setEntries((data || []).map(fromRow));
  }, [user, isAdmin, toast]);

  useEffect(() => { load(); }, [load]);

  const handleAddEntry = async (entry: Omit<HistoryEntry, 'id'>) => {
    if (!user) return;
    const { error } = await supabase.from('personal_history').insert({ ...toRow(entry), user_id: user.id });
    if (error) return toast({ title: 'Error', description: error.message, variant: 'destructive' });
    setIsFormOpen(false);
    load();
  };

  const handleEditEntry = async (entry: Omit<HistoryEntry, 'id'>) => {
    if (!editingEntry) return;
    const { error } = await supabase.from('personal_history').update(toRow(entry)).eq('id', editingEntry.id);
    if (error) return toast({ title: 'Error', description: error.message, variant: 'destructive' });
    setEditingEntry(null);
    setIsFormOpen(false);
    load();
  };

  const handleDeleteEntry = async (id: string) => {
    await supabase.from('personal_history').delete().eq('id', id);
    load();
  };
  const handleTogglePrivacy = async (id: string) => {
    const e = entries.find((x) => x.id === id);
    if (!e) return;
    await supabase.from('personal_history').update({ is_private: !e.isPrivate }).eq('id', id);
    toast({ title: e.isPrivate ? 'Now shared with your family' : 'Now secret — only you can see it' });
    load();
  };

  const filteredEntries = activeTab === 'all' ? entries : entries.filter((e) => e.category === activeTab);

  return (
    <AppLayout title="Personal History">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <p className="text-muted-foreground">
          {isAdmin
            ? "Entries your children chose to share with the family. Secret entries stay private to them."
            : 'Write your journey. Keep each entry secret or share it with your family.'}
        </p>
        {!isAdmin && <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
          <DialogTrigger asChild>
            <Button variant="hero" onClick={() => setEditingEntry(null)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Entry
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>{editingEntry ? 'Edit Entry' : 'New Entry'}</DialogTitle>
            </DialogHeader>
            <HistoryEntryForm
              entry={editingEntry}
              onSubmit={editingEntry ? handleEditEntry : handleAddEntry}
              onCancel={() => { setIsFormOpen(false); setEditingEntry(null); }}
            />
          </DialogContent>
        </Dialog>}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-8">
        <TabsList className="flex flex-wrap h-auto gap-2 bg-transparent p-0">
          <TabsTrigger value="all" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-full px-4">
            All
          </TabsTrigger>
          {Object.entries(categoryLabels).map(([key, label]) => {
            const Icon = categoryIcons[key as HistoryCategory];
            return (
              <TabsTrigger key={key} value={key} className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground rounded-full px-4 gap-2">
                <Icon className="h-4 w-4" />
                {label}
              </TabsTrigger>
            );
          })}
        </TabsList>
      </Tabs>

      <HistoryTimeline
        entries={filteredEntries}
        onEdit={(entry) => { setEditingEntry(entry); setIsFormOpen(true); }}
        onDelete={handleDeleteEntry}
        onTogglePrivacy={handleTogglePrivacy}
        categoryIcons={categoryIcons}
        categoryLabels={categoryLabels}
        readOnly={isAdmin}
      />
    </AppLayout>
  );
};

export default PersonalHistory;
