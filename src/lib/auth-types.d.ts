import "next-auth";

declare module "next-auth" {
  interface User {
    backendToken?: string;
    shopId?: string;
    shops?: { id: string; name: string; isDefault: boolean }[];
    maxShops?: number;
    plan?: string;
  }

  interface Session {
    user: {
      backendToken?: string;
      shopId?: string;
      shops?: { id: string; name: string; isDefault: boolean }[];
      maxShops?: number;
      plan?: string;
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
    plan?: string;
  }
}
