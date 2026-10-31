import { act, renderHook, waitFor, cleanup } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useAuth } from '@/hooks/useAuth';

const mocks = vi.hoisted(() => ({ rpc: vi.fn(), from: vi.fn(), auth: vi.fn(), update: vi.fn() }));
vi.mock('@/integrations/supabase/client', () => ({ supabase: {
  rpc: mocks.rpc, from: mocks.from,
  auth: { onAuthStateChange: mocks.auth, getSession: vi.fn(async () => ({ data: { session: null } })) },
} }));

beforeEach(() => {
  vi.clearAllMocks();
  mocks.rpc.mockResolvedValue({ data: 'islam', error: null });
  mocks.auth.mockImplementation(callback => {
    callback('SIGNED_IN', { user: { id: 'child-id' } });
    return { data: { subscription: { unsubscribe: vi.fn() } } };
  });
  mocks.from.mockImplementation(table => ({
    select: () => ({ eq: () => ({ single: async () => ({ data: table === 'user_roles' ? { role: 'student' } : { user_id: 'child-id', religion: null } }) }) }),
    update: mocks.update,
  }));
});
afterEach(cleanup);

describe('family religion', () => {
  it('enables Islamic Learning for a child inheriting Islam despite an unset child profile religion', async () => {
    const { result } = renderHook(() => useAuth());
    await waitFor(() => expect(result.current.isMuslim).toBe(true));
    expect(mocks.rpc).toHaveBeenCalledWith('get_family_religion', { _user_id: 'child-id' });
    expect(result.current.profile?.religion).toBeNull();
  });

  it('does not enable Islamic Learning for a family choosing Christianity', async () => {
    mocks.rpc.mockResolvedValue({ data: 'christianity', error: null });
    const { result } = renderHook(() => useAuth());
    await waitFor(() => expect(result.current.religion).toBe('christianity'));
    expect(result.current.isMuslim).toBe(false);
  });

  it('refreshes all mounted hooks when a parent saves Islam', async () => {
    mocks.rpc.mockResolvedValue({ data: null, error: null });
    const { result } = renderHook(() => useAuth());
    await waitFor(() => expect(result.current.profile).not.toBeNull());
    mocks.update.mockImplementation(updates => ({ eq: () => ({ select: () => ({ single: async () => ({ data: { user_id: 'child-id', ...updates }, error: null }) }) }) }));
    mocks.rpc.mockResolvedValue({ data: 'islam', error: null });
    await act(async () => { await result.current.updateProfile({ religion: 'islam' }); });
    await waitFor(() => expect(result.current.isMuslim).toBe(true));
    expect(mocks.update).toHaveBeenCalledWith({ religion: 'islam' });
  });
});