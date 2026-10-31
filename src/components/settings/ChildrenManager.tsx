import { useState } from 'react';
import { Plus, Trash2, Users, Key, Loader2, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ChildAccount {
  id: string;
  email: string;
  full_name: string | null;
  created_at: string;
}

interface ChildrenManagerProps {
  userId: string;
  children: ChildAccount[];
  onChildrenUpdated: () => void;
}

export const ChildrenManager = ({
  userId,
  children,
  onChildrenUpdated,
}: ChildrenManagerProps) => {
  const { toast } = useToast();

  // Add child form state
  const [showAddChild, setShowAddChild] = useState(false);
  const [newChildEmail, setNewChildEmail] = useState('');
  const [newChildPassword, setNewChildPassword] = useState('');
  const [newChildName, setNewChildName] = useState('');
  const [creatingChild, setCreatingChild] = useState(false);

  // Reset password dialog state
  const [resetPasswordDialog, setResetPasswordDialog] = useState(false);
  const [selectedChild, setSelectedChild] = useState<ChildAccount | null>(null);
  const [newPasswordForChild, setNewPasswordForChild] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [resettingPassword, setResettingPassword] = useState(false);

  const handleCreateChildAccount = async () => {
    if (!newChildEmail || !newChildPassword || !newChildName) {
      toast({
        title: 'Error',
        description: 'Please fill in all fields',
        variant: 'destructive',
      });
      return;
    }

    setCreatingChild(true);

    try {
      const { data, error } = await supabase.functions.invoke('create-child-account', {
        body: { email: newChildEmail, password: newChildPassword, fullName: newChildName },
      });
      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      toast({
        title: 'Success',
        description: data?.existed
          ? 'Existing account linked to your family. The password was updated.'
          : 'Child account created. They can sign in now with this email and password.',
      });
      setNewChildEmail('');
      setNewChildPassword('');
      setNewChildName('');
      setShowAddChild(false);
      onChildrenUpdated();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setCreatingChild(false);
    }
  };

  const handleRemoveChild = async (childId: string) => {
    const { error } = await supabase
      .from('parent_child_relationships')
      .delete()
      .eq('parent_id', userId)
      .eq('child_id', childId);

    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to remove child account',
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Success',
        description: 'Child account removed',
      });
      onChildrenUpdated();
    }
  };

  const openResetPasswordDialog = (child: ChildAccount) => {
    setSelectedChild(child);
    setNewPasswordForChild('');
    setResetPasswordDialog(true);
  };

  const handleResetChildPassword = async () => {
    if (!selectedChild || !newPasswordForChild) {
      toast({
        title: 'Error',
        description: 'Please enter a new password',
        variant: 'destructive',
      });
      return;
    }

    if (newPasswordForChild.length < 6) {
      toast({
        title: 'Error',
        description: 'Password must be at least 6 characters',
        variant: 'destructive',
      });
      return;
    }

    setResettingPassword(true);

    try {
      const { data: sessionData } = await supabase.auth.getSession();
      
      const response = await supabase.functions.invoke('reset-child-password', {
        body: {
          childId: selectedChild.id,
          newPassword: newPasswordForChild,
        },
      });

      if (response.error) throw response.error;

      toast({
        title: 'Success',
        description: `Password reset for ${selectedChild.full_name || selectedChild.email}`,
      });
      setResetPasswordDialog(false);
      setSelectedChild(null);
      setNewPasswordForChild('');
    } catch (error: any) {
      console.error('Reset password error:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to reset password',
        variant: 'destructive',
      });
    } finally {
      setResettingPassword(false);
    }
  };

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Manage Children Accounts</CardTitle>
              <CardDescription>
                Create and manage accounts for your children
              </CardDescription>
            </div>
            <Button onClick={() => setShowAddChild(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Child
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {showAddChild && (
            <div className="mb-6 p-4 rounded-xl border border-border bg-muted/50 space-y-4">
              <h4 className="font-semibold">Create New Child Account</h4>
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label htmlFor="childName">Child's Full Name</Label>
                  <Input
                    id="childName"
                    value={newChildName}
                    onChange={(e) => setNewChildName(e.target.value)}
                    placeholder="Enter child's name"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="childEmail">Email Address</Label>
                  <Input
                    id="childEmail"
                    type="email"
                    value={newChildEmail}
                    onChange={(e) => setNewChildEmail(e.target.value)}
                    placeholder="Enter email address"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="childPassword">Password</Label>
                  <Input
                    id="childPassword"
                    type="password"
                    value={newChildPassword}
                    onChange={(e) => setNewChildPassword(e.target.value)}
                    placeholder="Create a password"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button onClick={handleCreateChildAccount} disabled={creatingChild}>
                  {creatingChild ? 'Creating...' : 'Create Account'}
                </Button>
                <Button variant="outline" onClick={() => setShowAddChild(false)}>
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {children.length > 0 ? (
            <div className="space-y-4">
              {children.map((child) => (
                <div
                  key={child.id}
                  className="flex items-center justify-between p-4 rounded-xl border border-border"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                      <span className="font-semibold text-primary">
                        {child.full_name?.charAt(0) || child.email.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium">{child.full_name || 'No name'}</p>
                      <p className="text-sm text-muted-foreground">{child.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => openResetPasswordDialog(child)}
                    >
                      <Key className="h-4 w-4 mr-2" />
                      Reset Password
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={() => handleRemoveChild(child.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-semibold mb-2">No Children Added</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Create accounts for your children to track their academic progress
              </p>
              {!showAddChild && (
                <Button onClick={() => setShowAddChild(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Your First Child
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Reset Password Dialog */}
      <Dialog open={resetPasswordDialog} onOpenChange={setResetPasswordDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reset Password</DialogTitle>
            <DialogDescription>
              Set a new password for {selectedChild?.full_name || selectedChild?.email}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="newChildPassword">New Password</Label>
              <div className="relative">
                <Input
                  id="newChildPassword"
                  type={showNewPassword ? 'text' : 'password'}
                  value={newPasswordForChild}
                  onChange={(e) => setNewPasswordForChild(e.target.value)}
                  placeholder="Enter new password"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showNewPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              <p className="text-xs text-muted-foreground">
                Password must be at least 6 characters
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setResetPasswordDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleResetChildPassword} disabled={resettingPassword}>
              {resettingPassword ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Resetting...
                </>
              ) : (
                'Reset Password'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
