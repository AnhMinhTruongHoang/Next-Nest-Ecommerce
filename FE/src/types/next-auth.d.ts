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

  interface IProduct {
    _id: string;
    thumbnail: string;
    slider: string[];
    name: string;
    brand: string;
    price: number;
    stock: number;
    sold: number;
    quantity: number;
    category: string;
    createdAt: Date;
    updatedAt: Date;
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

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: IUser;
    access_token: string;
    refresh_token: string;
    access_expire: number;
    error: string;
  }
}
