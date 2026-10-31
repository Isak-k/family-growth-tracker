import { supabase } from '@/integrations/supabase/client';
import type { Json } from '@/integrations/supabase/types';

export function useActivityLog() {
  const logActivity = async (
    action: string,
    description?: string,
    metadata?: Json
  ) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase.from('activity_log').insert([{
      user_id: user.id,
      action,
      description: description || null,
      metadata: metadata ?? {},
    }]);
  };

  return { logActivity };
}
