// Simple token-based authentication for frontend
// Replaces NextAuth with direct backend API calls

interface User {
  id: string;
  email: string;
  practice_name: string;
}

interface AuthSession {
  user: User;
  token: string;
}

// Helper to ensure URL has protocol
const ensureAbsoluteUrl = (url: string | undefined): string => {
  if (!url) return 'http://localhost:3001';
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  return `https://${url}`;
};

export class AuthClient {
  private static TOKEN_KEY = 'docchase_token';
  private static USER_KEY = 'docchase_user';

  // Get current session from localStorage
  static getSession(): AuthSession | null {
    if (typeof window === 'undefined') return null;

    const token = localStorage.getItem(this.TOKEN_KEY);
    const userStr = localStorage.getItem(this.USER_KEY);

    console.log('[AuthClient] Getting session:', {
      hasToken: !!token,
      hasUser: !!userStr,
      tokenLength: token?.length
    });

    if (!token || !userStr) {
      console.log('[AuthClient] Missing token or user data');
      return null;
    }

    try {
      const user = JSON.parse(userStr);
      console.log('[AuthClient] Session found for:', user.email);
      return { user, token };
    } catch (error) {
      console.error('[AuthClient] Failed to parse user data:', error);
      return null;
    }
  }

  // Save session to localStorage
  static setSession(user: User, token: string) {
    if (typeof window === 'undefined') return;

    console.log('[AuthClient] Setting session for:', user.email, 'token length:', token.length);
    localStorage.setItem(this.TOKEN_KEY, token);
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    console.log('[AuthClient] Session saved successfully');
  }

  // Clear session from localStorage
  static clearSession() {
    if (typeof window === 'undefined') return;

    console.log('[AuthClient] Clearing session');
    console.trace('[AuthClient] Clear session called from:');
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
  }

  // Register new user
  static async register(practiceName: string, email: string, password: string): Promise<AuthSession> {
    // @ts-ignore
    const apiUrl = ensureAbsoluteUrl(process.env.NEXT_PUBLIC_API_URL);

    const response = await fetch(`${apiUrl}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ practice_name: practiceName, email, password }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Registration failed' }));
      throw new Error(error.error || 'Registration failed');
    }

    const data = await response.json();
    const session = {
      user: {
        id: data.accountant.id,
        email: data.accountant.email,
        practice_name: data.accountant.practice_name,
      },
      token: data.token,
    };

    this.setSession(session.user, session.token);
    return session;
  }

  // Login existing user
  static async login(email: string, password: string): Promise<AuthSession> {
    // @ts-ignore
    const apiUrl = ensureAbsoluteUrl(process.env.NEXT_PUBLIC_API_URL);

    const response = await fetch(`${apiUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Login failed' }));
      throw new Error(error.error || 'Invalid credentials');
    }

    const data = await response.json();
    const session = {
      user: {
        id: data.accountant.id,
        email: data.accountant.email,
        practice_name: data.accountant.practice_name,
      },
      token: data.token,
    };

    this.setSession(session.user, session.token);
    return session;
  }

  // Logout
  static logout() {
    this.clearSession();
    if (typeof window !== 'undefined') {
      window.location.href = '/login';
    }
  }

  // Check if user is authenticated (for client components)
  static isAuthenticated(): boolean {
    return this.getSession() !== null;
  }
}
