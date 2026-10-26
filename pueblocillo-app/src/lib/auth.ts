import { UserAccount, AuthSession } from '@/types/census';

export const DEMO_ACCOUNTS: (UserAccount & { passwordHash: string })[] = [
  {
    id: 'usr-admin',
    email: 'admin@pueblocillo.org',
    passwordHash: 'admin2026!',
    name: 'Eduardo Villanueva (HOA President)',
    role: 'admin',
    badge: 'HOA Administrator',
    canEditSettings: true,
    canEncode: true,
    canDelete: true
  },
  {
    id: 'usr-encoder-1',
    email: 'encoder1@pueblocillo.org',
    passwordHash: 'encoder2026!',
    name: 'Maria Santos (Field Coordinator)',
    role: 'encoder1',
    badge: 'Encoder #1 (West Zone)',
    canEditSettings: false,
    canEncode: true,
    canDelete: false
  },
  {
    id: 'usr-encoder-2',
    email: 'encoder2@pueblocillo.org',
    passwordHash: 'encoder2026!',
    name: 'Danilo Cruz (Street Coordinator)',
    role: 'encoder2',
    badge: 'Encoder #2 (East Zone)',
    canEditSettings: false,
    canEncode: true,
    canDelete: false
  },
  {
    id: 'usr-resident',
    email: 'resident@pueblocillo.org',
    passwordHash: 'resident2026!',
    name: 'Ricardo Tolentino (Homeowner)',
    role: 'resident',
    badge: 'Verified Resident (Blk 2 L 12)',
    block: 2,
    lot: 12,
    canEditSettings: false,
    canEncode: false,
    canDelete: false
  }
];

const AUTH_STORAGE_KEY = 'pueblocillo_auth_session_v1';
const LOGIN_ATTEMPTS_KEY = 'pueblocillo_login_attempts_v1';

export interface RateLimitState {
  attempts: number;
  lockedUntil: number;
}

export const checkRateLimit = (email: string): { isLocked: boolean; remainingSec: number } => {
  if (typeof window === 'undefined') return { isLocked: false, remainingSec: 0 };
  try {
    const raw = localStorage.getItem(`${LOGIN_ATTEMPTS_KEY}_${email.toLowerCase()}`);
    if (!raw) return { isLocked: false, remainingSec: 0 };
    const state: RateLimitState = JSON.parse(raw);
    const now = Date.now();
    if (state.lockedUntil > now) {
      const remainingSec = Math.ceil((state.lockedUntil - now) / 1000);
      return { isLocked: true, remainingSec };
    }
    return { isLocked: false, remainingSec: 0 };
  } catch {
    return { isLocked: false, remainingSec: 0 };
  }
};

export const recordFailedAttempt = (email: string): { isLocked: boolean; remainingSec: number } => {
  if (typeof window === 'undefined') return { isLocked: false, remainingSec: 0 };
  const key = `${LOGIN_ATTEMPTS_KEY}_${email.toLowerCase()}`;
  try {
    const raw = localStorage.getItem(key);
    const state: RateLimitState = raw ? JSON.parse(raw) : { attempts: 0, lockedUntil: 0 };
    state.attempts += 1;
    if (state.attempts >= 5) {
      // Lock for 60 seconds after 5 failed attempts
      state.lockedUntil = Date.now() + 60 * 1000;
      localStorage.setItem(key, JSON.stringify(state));
      return { isLocked: true, remainingSec: 60 };
    }
    localStorage.setItem(key, JSON.stringify(state));
    return { isLocked: false, remainingSec: 0 };
  } catch {
    return { isLocked: false, remainingSec: 0 };
  }
};

export const clearFailedAttempts = (email: string): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(`${LOGIN_ATTEMPTS_KEY}_${email.toLowerCase()}`);
};

export const authenticateUser = (email: string, password: string): { success: boolean; user?: UserAccount; error?: string } => {
  const cleanEmail = email.trim().toLowerCase();
  const rateLimit = checkRateLimit(cleanEmail);
  if (rateLimit.isLocked) {
    return {
      success: false,
      error: `Too many failed login attempts. Account temporarily locked for security. Please try again in ${rateLimit.remainingSec} seconds.`
    };
  }

  const match = DEMO_ACCOUNTS.find((u) => u.email.toLowerCase() === cleanEmail);
  if (!match || match.passwordHash !== password) {
    const failed = recordFailedAttempt(cleanEmail);
    if (failed.isLocked) {
      return {
        success: false,
        error: `Too many failed login attempts. Account temporarily locked for security. Try again in ${failed.remainingSec} seconds.`
      };
    }
    return { success: false, error: 'Invalid email address or security credential.' };
  }

  clearFailedAttempts(cleanEmail);

  // Exclude password hash from returned object
  const { passwordHash, ...safeUser } = match;
  return { success: true, user: safeUser };
};

export const saveAuthSession = (user: UserAccount): void => {
  if (typeof window === 'undefined') return;
  const session: AuthSession = {
    user,
    token: `pueblocillo_jwt_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
    expiresAt: Date.now() + 24 * 60 * 60 * 1000 // 24 hours
  };
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
};

export const getStoredAuthSession = (): UserAccount | null => {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    if (!raw) return null;
    const session: AuthSession = JSON.parse(raw);
    if (Date.now() > session.expiresAt) {
      clearAuthSession();
      return null;
    }
    return session.user;
  } catch {
    return null;
  }
};

export const clearAuthSession = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(AUTH_STORAGE_KEY);
};
