import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { db } from "~/server/db";
import { compare } from "bcryptjs";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID ?? process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.AUTH_GOOGLE_SECRET ?? process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const email = credentials.email as string;
        const password = credentials.password as string;

        const user = await db.user.findUnique({ where: { email } });

        if (!user?.password) return null;

        const isValid = await compare(password, user.password);
        if (!isValid) return null;

        return user;
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (token.email) {
        // 1. Look up the user in our PostgreSQL database
        let dbUser = await db.user.findUnique({
          where: { email: token.email }
        });

        // Determine if this user should be ADMIN
        const isAdminEmail = token.email === "pianella489@gmail.com";
        const targetRole = isAdminEmail ? "ADMIN" : (dbUser?.role ?? "USER");

        // 2. If they don't exist yet, create them!
        if (!dbUser) {
          dbUser = await db.user.create({
            data: {
              email: token.email,
              name: token.name ?? user?.name ?? "User",
              image: token.picture ?? user?.image,
              role: targetRole,
            }
          });
        } else if (isAdminEmail && dbUser.role !== "ADMIN") {
          // Ensure admin email is always ADMIN role in DB
          dbUser = await db.user.update({
            where: { id: dbUser.id },
            data: { role: "ADMIN" }
          });
        }

        // 3. Force the session token ID and role to strictly be the PostgreSQL values
        token.sub = dbUser.id;
        token.name = dbUser.name;
        token.role = dbUser.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.sub!;
        session.user.name = token.name ?? session.user.name;
        session.user.email = token.email ?? session.user.email;
        session.user.role = (token.role as "USER" | "ADMIN") ?? "USER";
      }
      return session;
    },
  },
});