import "next-auth";

declare module "next-auth" {
  interface User {
    token?: string;
    role?: string;
  }

  interface Session {
    user: {
      backendToken?: string;
      role?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    backendToken?: string;
    role?: string;
  }
}
