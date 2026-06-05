import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          return null;
        }

        try {
          // Call Go backend to authenticate
          const res = await fetch(`${API_BASE}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              username: credentials.username,
              password: credentials.password,
            }),
          });

          if (!res.ok) {
            console.error("[AUTH] Backend login failed:", res.status);
            return null;
          }

          const data = await res.json();

          // Return user object with token from backend
          return {
            id: "admin",
            name: credentials.username as string,
            role: "admin",
            token: data.token,
          };
        } catch (error) {
          console.error("[AUTH] Login error:", error);
          return null;
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      // On sign-in, store the backend JWT + user info
      if (user) {
        token.backendToken = user.token;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      // Expose backend token + role to the client session
      session.user.backendToken = token.backendToken as string;
      session.user.role = token.role as string;
      return session;
    },
  },

  pages: {
    signIn: "/login",
  },

  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24 hours
  },

  trustHost: true,
});
