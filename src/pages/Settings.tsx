import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User,
  Bell,
  Users,
  Shield,
  Mail,
  Phone,
  LogOut,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AppLayout } from '@/components/AppLayout';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { AvatarUpload } from '@/components/settings/AvatarUpload';
import { ChangePassword } from '@/components/settings/ChangePassword';
import { ChildrenManager } from '@/components/settings/ChildrenManager';
import { FamilyReligionSettings } from '@/components/settings/FamilyReligionSettings';

interface ChildAccount {
  id: string;
  email: string;
  full_name: string | null;
  created_at: string;
}

interface NotificationPreferences {
  email_notifications: boolean;
  grade_alerts: boolean;
  attendance_alerts: boolean;
  weekly_summary: boolean;
}

const Settings = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, profile, role, isAdmin, loading, updateProfile, signOut } = useAuth();

  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const [notifications, setNotifications] = useState<NotificationPreferences>({
    email_notifications: true,
    grade_alerts: true,
    attendance_alerts: true,
    weekly_summary: true,
  });

  const [children, setChildren] = useState<ChildAccount[]>([]);

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || '');
      setPhone(profile.phone || '');
      setAvatarUrl(profile.avatar_url || null);
    }
  }, [profile]);

  useEffect(() => {
    if (user) {
      fetchNotificationPreferences();
      if (isAdmin) fetchChildren();
    }
  }, [user, isAdmin]);

  const fetchNotificationPreferences = async () => {
    if (!user) return;
    const { data } = await supabase
      .from('notification_preferences')
      .select('*')
      .eq('user_id', user.id)
      .single();
    if (data) {
      setNotifications({
        email_notifications: data.email_notifications ?? true,
        grade_alerts: data.grade_alerts ?? true,
        attendance_alerts: data.attendance_alerts ?? true,
        weekly_summary: data.weekly_summary ?? true,
      });
    }
  };

  const fetchChildren = async () => {
    if (!user) return;
    const { data: relationships } = await supabase
      .from('parent_child_relationships')
      .select('child_id')
      .eq('parent_id', user.id);
    if (relationships && relationships.length > 0) {
      const childIds = relationships.map(r => r.child_id);
      const { data: childProfiles } = await supabase.from('profiles').select('*').in('user_id', childIds);
      if (childProfiles) {
        setChildren(childProfiles.map(p => ({ id: p.user_id, email: p.email, full_name: p.full_name, created_at: p.created_at })));
      }
    } else {
      setChildren([]);
    }
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    const { error } = await updateProfile({ full_name: fullName, phone });
    setSaving(false);
    if (error) {
      toast({ title: 'Error', description: 'Failed to update profile', variant: 'destructive' });
    } else {
      toast({ title: 'Success', description: 'Profile updated successfully' });
    }
  };

  const handleSaveNotifications = async () => {
    if (!user) return;
    const { error } = await supabase.from('notification_preferences').update(notifications).eq('user_id', user.id);
    if (error) {
      toast({ title: 'Error', description: 'Failed to update notification preferences', variant: 'destructive' });
    } else {
      toast({ title: 'Success', description: 'Notification preferences updated' });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  const fallbackInitial = fullName?.charAt(0) || user?.email?.charAt(0)?.toUpperCase() || '?';

  return (
    <AppLayout title="Settings">
      <div className="max-w-4xl mx-auto">
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-auto lg:inline-grid">
            <TabsTrigger value="profile" className="gap-2"><User className="h-4 w-4" />Profile</TabsTrigger>
            <TabsTrigger value="notifications" className="gap-2"><Bell className="h-4 w-4" />Notifications</TabsTrigger>
            {isAdmin && <TabsTrigger value="children" className="gap-2"><Users className="h-4 w-4" />Children</TabsTrigger>}
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>Update your personal information and preferences</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {user && (
                  <AvatarUpload
                    userId={user.id}
                    currentAvatarUrl={avatarUrl}
                    fallbackInitial={fallbackInitial}
                    onAvatarUpdated={(url) => setAvatarUrl(url || null)}
                  />
                )}
                <div className="flex items-center gap-1 mt-1">
                  <Shield className="h-3 w-3 text-primary" />
                  <span className="text-xs text-primary capitalize">{role}</span>
                </div>
                <div className="grid gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Enter your full name" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <Input id="email" value={user?.email || ''} disabled className="bg-muted" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Enter your phone number" />
                    </div>
                  </div>
                </div>
                <Button onClick={handleSaveProfile} disabled={saving}>
                  {saving ? 'Saving...' : 'Save Changes'}
                </Button>
              </CardContent>
            </Card>
            <FamilyReligionSettings />
            <ChangePassword />
            <Card>
              <CardHeader>
                <CardTitle>Log Out</CardTitle>
                <CardDescription>Sign out of your account on this device</CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  variant="destructive"
                  className="gap-2"
                  onClick={async () => {
                    await signOut();
                    navigate('/login', { replace: true });
                  }}
                >
                  <LogOut className="h-4 w-4" />
                  Log Out
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>Choose how you want to receive updates and alerts</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {[
                  { key: 'email_notifications', label: 'Email Notifications', desc: 'Receive notifications via email' },
                  { key: 'grade_alerts', label: 'Grade Alerts', desc: 'Get notified when new grades are posted' },
                  { key: 'attendance_alerts', label: 'Attendance Alerts', desc: 'Get notified about attendance issues' },
                  { key: 'weekly_summary', label: 'Weekly Summary', desc: 'Receive a weekly progress report' },
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{item.label}</p>
                      <p className="text-sm text-muted-foreground">{item.desc}</p>
                    </div>
                    <Switch
                      checked={notifications[item.key as keyof NotificationPreferences]}
                      onCheckedChange={(checked) =>
                        setNotifications((prev) => ({ ...prev, [item.key]: checked }))
                      }
                    />
                  </div>
                ))}
                <Button onClick={handleSaveNotifications}>Save Preferences</Button>
              </CardContent>
            </Card>
          </TabsContent>

          {isAdmin && user && (
            <TabsContent value="children">
              <ChildrenManager userId={user.id} children={children} onChildrenUpdated={fetchChildren} />
            </TabsContent>
          )}
        </Tabs>
      </div>
    </AppLayout>
  );
};

export default Settings;
