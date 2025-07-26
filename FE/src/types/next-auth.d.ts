// types/next-auth.d.ts
import NextAuth, { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface Session {
    access_token?: string;
    refresh_token?: string;
    user: {
      id?: string;
      username?: string;
      email?: string;
      [key: string]: any;
    };
  }

  interface User extends DefaultUser {
    access_token?: string;
    refresh_token?: string;
    user?: any;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    access_token?: string;
    refresh_token?: string;
    user?: any;
  }
}
