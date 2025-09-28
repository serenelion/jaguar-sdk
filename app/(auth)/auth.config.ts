import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
  pages: {
    signIn: '/login',
    newUser: '/',
  },
  providers: [
    // added later in auth.ts since it requires bcrypt which is only compatible with Node.js
    // while this file is also used in non-Node.js environments
  ],
  session: {
    strategy: 'jwt',
    maxAge: 24 * 60 * 60, // 24 hours
  },
  secret: process.env.AUTH_SECRET,
  trustHost: true,
  useSecureCookies: process.env.NODE_ENV === 'production',
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      // Allow all requests - handle redirects in individual pages instead
      // This prevents timing issues with session updates causing redirect loops
      return true;
    },
  },
} satisfies NextAuthConfig;
