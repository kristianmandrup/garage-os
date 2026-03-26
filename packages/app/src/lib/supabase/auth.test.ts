import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock the Supabase server client
vi.mock('@/lib/supabase/server', () => ({
  createClient: vi.fn(() => ({
    auth: {
      signInWithOAuth: vi.fn(),
      signOut: vi.fn(),
      getSession: vi.fn(),
      getUser: vi.fn(),
      exchangeCodeForSession: vi.fn(),
    },
  })),
}));

describe('Auth Utils', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should create supabase client', async () => {
    const { createClient } = await import('@/lib/supabase/server');
    const client = await createClient();
    expect(client).toBeDefined();
    expect(client.auth).toBeDefined();
  });
});
