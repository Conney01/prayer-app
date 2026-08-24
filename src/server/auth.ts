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

        // 2. If they logged in via Google and don't exist yet, create them!
        dbUser ??= await db.user.create({
          data: {
            email: token.email,
            name: token.name ?? user?.name ?? "User",
            image: token.picture ?? user?.image,
          }
        });

        // 3. Force the session token ID to strictly be the PostgreSQL database ID
        token.sub = dbUser.id;
        token.name = dbUser.name;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.sub!;
        session.user.name = token.name ?? session.user.name;
        session.user.email = token.email ?? session.user.email;
      }
      return session;
    },
  },
});