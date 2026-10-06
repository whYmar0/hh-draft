import { type NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { prisma } from '@/lib/db/prisma';
import { comparePassword } from '@/lib/auth/password';
import { loginSchema } from '@/lib/validations/auth';

export const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 дней
  },
  pages: {
    signIn: '/login',
    error: '/login',
  },
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { email: parsed.data.email },
          include: {
            studentProfile: { select: { id: true } },
            companyProfile: { select: { id: true } },
          },
        });

        if (!user || !user.passwordHash) {
          return null;
        }

        if (user.status === 'SUSPENDED') {
          throw new Error('Аккаунт заблокирован');
        }

        const isValid = await comparePassword(parsed.data.password, user.passwordHash);
        if (!isValid) {
          return null;
        }

        return {
          id: user.id,
          email: user.email,
          role: user.role,
          studentProfileId: user.studentProfile?.id ?? null,
          companyProfileId: user.companyProfile?.id ?? null,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
        token.studentProfileId = (user as any).studentProfileId;
        token.companyProfileId = (user as any).companyProfileId;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
        (session.user as any).studentProfileId = token.studentProfileId;
        (session.user as any).companyProfileId = token.companyProfileId;
      }
      return session;
    },
  },
};
