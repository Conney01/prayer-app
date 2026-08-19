import { type DefaultSession, type NextAuthConfig } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import bcrypt from "bcryptjs";
import { db } from "~/server/db";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      role: "USER" | "ADMIN";
      currentStreak: number;
    } & DefaultSession["user"];
  }

  interface User {
    role?: "USER" | "ADMIN";
    currentStreak?: number;
  }
}

export const authConfig = {
  trustHost: true,
  providers: [
    GoogleProvider({
      clientId: process.env.AUTH_GOOGLE_ID ?? process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.AUTH_GOOGLE_SECRET ?? process.env.GOOGLE_CLIENT_SECRET ?? "",
      allowDangerousEmailAccountLinking: true,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials) return null;
        const email = typeof credentials.email === "string" ? credentials.email.trim().toLowerCase() : "";
        const password = typeof credentials.password === "string" ? credentials.password : "";

        if (!email || !password) {
          return null;
        }

        const user = await db.user.findUnique({
          where: { email },
        });

        if (!user?.password) {
          return null;
        }

        const passwordsMatch = await bcrypt.compare(password, user.password);
        if (!passwordsMatch) {
          return null;
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          currentStreak: user.currentStreak,
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google" && user.email) {
        const normalizedEmail = user.email.trim().toLowerCase();
        const existingUser = await db.user.findUnique({
          where: { email: normalizedEmail },
        });

        if (!existingUser) {
          const newUser = await db.user.create({
            data: {
              email: normalizedEmail,
              name: user.name ?? "Sanctuary Seeker",
              role: "USER",
              currentStreak: 1,
              longestStreak: 1,
            },
          });
          user.id = newUser.id;
          user.role = newUser.role;
          user.currentStreak = newUser.currentStreak;
        } else {
          user.id = existingUser.id;
          user.role = existingUser.role;
          user.currentStreak = existingUser.currentStreak;
        }
      }
      return true;
    },
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role ?? "USER";
        token.currentStreak = user.currentStreak ?? 0;
      }
      return token;
    },
    session({ session, token }) {
      if (token && session.user) {
        session.user.id = typeof token.id === "string" ? token.id : (token.sub ?? "");
        session.user.role = (token.role as "USER" | "ADMIN") ?? "USER";
        session.user.currentStreak = typeof token.currentStreak === "number" ? token.currentStreak : 0;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
} satisfies NextAuthConfig;