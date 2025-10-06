import NextAuth, { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface IUser {
    _id: string;
    email: string;
    name: string;
    accountType: "LOCAL" | "GOOGLE" | string;
    role: "USER" | "ADMIN" | string;
    age: number;
    address: string;
    isDeleted: boolean;
    isActive: boolean;
    gender: "male" | "female" | string;
    codeId: string;
    codeExpired: string;
    deletedAt: string | null;
    createdAt: string;
    updatedAt: string;
    __v: number;
  }

  interface Session {
    user: IUser;
    access_token: string;
    refresh_token: string;
    access_expire: number;
    error?: string;
  }

  interface IFetchAccount {
    user: IUser;
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
