import NextAuth, { DefaultSession, DefaultUser } from "next-auth";
import { JWT as DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    access_token?: string;
    refresh_token?: string;
    email?: string | null;
    name?: string | null;
    role?: string;
    user?: {
      _id?: string;
      email?: string;
      name?: string;
      role?: string;
    };
  }

  interface User extends DefaultUser {
    access_token?: string;
    refresh_token?: string;
    user?: {
      _id?: string;
      email?: string;
      name?: string;
      role?: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    access_token?: string;
    refresh_token?: string;
    role?: string;
    user?: {
      _id?: string;
      email?: string;
      name?: string;
      role?: string;
    };
  }
}
