import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

// Helper to ensure URL has protocol
const ensureAbsoluteUrl = (url: string | undefined): string => {
  if (!url) return 'http://localhost:3001';
  if (url.startsWith('http://') || url.startsWith('https://')) return url;
  return `https://${url}`;
};

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          // @ts-ignore
          const apiUrl = ensureAbsoluteUrl(process.env.NEXT_PUBLIC_API_URL);

          const response = await fetch(`${apiUrl}/api/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          });

          if (!response.ok) {
            return null;
          }

          const data = await response.json();

          // Return user with API token
          return {
            id: data.accountant.id,
            email: data.accountant.email,
            name: data.accountant.practice_name,
            apiToken: data.token,
          } as any;
        } catch (error) {
          console.error('Login error:', error);
          return null;
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async jwt({ token, user, account }) {
      // On sign in, store user ID and API token
      if (user) {
        token.id = user.id;
        // Store API token from the user object (we'll add it in authorize)
        if ((user as any).apiToken) {
          token.apiToken = (user as any).apiToken;
        }
      }
      return token;
    },
    async session({ session, token }) {
      // Add user ID and API token to the session
      if (session.user) {
        session.user.id = token.id as string;
        (session as any).apiToken = token.apiToken;
      }
      return session;
    },
  },
};
