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

  interface ICategory {
    _id?: string;
    name: string;
  }

  interface IProduct {
    _id: string;
    thumbnail: string;
    slider: string[];
    images: string[];
    name: string;
    brand: string;
    price: number;
    stock: number;
    sold: number;
    quantity: number;
    category: any;
    createdAt: Date;
    updatedAt: Date;
  }

  interface Session {
    user: IUser; // 👈 dùng IUser luôn, không cần object lỏng lẻo nữa
    access_token: string;
    refresh_token: string;
    access_expire: number;
    error?: string;
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
