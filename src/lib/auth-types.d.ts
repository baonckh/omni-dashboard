import "next-auth";

declare module "next-auth" {
  interface User {
    backendToken?: string;
    shopId?: string;
  }

  interface Session {
    user: {
      backendToken?: string;
      shopId?: string;
      id?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    backendToken?: string;
    shopId?: string;
    id?: string;
  }
}
