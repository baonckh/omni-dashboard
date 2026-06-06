import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        try {
          const res = await fetch(`${API_BASE}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email: credentials.email, password: credentials.password }),
          });
          if (!res.ok) return null;
          const data = await res.json();
          return {
            id: data.user_id,
            name: data.name,
            email: credentials.email as string,
            shopId: data.shop_id,
            backendToken: data.token,
          };
        } catch {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.backendToken = user.backendToken;
        token.shopId = user.shopId;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token.backendToken) session.user.backendToken = token.backendToken as string;
      if (token.shopId) session.user.shopId = token.shopId as string;
      if (token.id) session.user.id = token.id as string;
      return session;
    },
  },
  pages: { signIn: "/login" },
  session: { strategy: "jwt", maxAge: 24 * 60 * 60 },
  trustHost: true,
});
