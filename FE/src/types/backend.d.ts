import NextAuth, { DefaultSession, DefaultUser } from "next-auth";
import { IUser } from "next-auth";

export {}; // bắt buộc để biến đây thành module, tránh lỗi duplicate

//  GLOBAL TYPES DÙNG CHUNG
declare global {
  interface IRequest {
    url: string;
    method: string;
    body?: { [key: string]: any };
    queryParams?: any;
    useCredentials?: boolean;
    headers?: any;
    nextOption?: any;
  }

  interface ICategory {
    _id?: string;
    name: string;
  }

  interface IProduct {
    _id: string;
    thumbnail: string;
    images: string[];
    description: string;
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

  interface ICart {
    _id: string;
    quantity: number;
    detail: IProduct;
  }

  interface IBackendRes<T> {
    error?: string | string[];
    message?: string;
    statusCode: number | string;
    data: T;
  }

  interface ILogin {
    user: {
      _id: string;
      name: string;
      email: string;
    };
    access_token: string;
  }

  interface IModelPaginate<T> {
    meta: {
      current: number;
      pageSize: number;
      pages: number;
      total: number;
    };
    result: T[];
  }
}

//  NEXT-AUTH MODULE EXTEND
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

  interface IFetchAccount {
    user: IUser;
  }

  interface Session {
    user: IUser;
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

  type Menu = {
    id: number;
    title: string;
    path?: string;
    newTab: boolean;
    submenu?: Menu[];
  };
}

declare module "next-auth/jwt" {
  interface JWT {
    access_token?: string;
    refresh_token?: string;
    user?: any;
  }
}
