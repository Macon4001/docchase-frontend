import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { db } from './db';
import { Accountant } from './types';

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

        const result = await db.query<Accountant>(
          'SELECT * FROM accountants WHERE email = $1',
          [credentials.email]
        );

        const accountant = result.rows[0];

        if (!accountant) {
          return null;
        }

        const isValid = await bcrypt.compare(
          credentials.password,
          accountant.password_hash
        );

        if (!isValid) {
          return null;
        }

        return {
          id: accountant.id,
          email: accountant.email,
          name: accountant.practice_name,
        };
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
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
};
