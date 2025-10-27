// types/global.d.ts
export {}; // Đảm bảo đây là một module

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

  interface IHistory {
    _id: string;
    name: string;
    type: string;
    email: string;
    phone: string;
    userId: string;
    detail: {
      bookName: string;
      quantity: number;
      _id: string;
    }[];
    totalPrice: number;
    createdAt: Date;
    updatedAt: Date;
    paymentStatus: string;
    paymentRef: string;
  }

  interface IOrderTable extends IHistory {}

  interface IUser {
    _id: string;
    email: string;
    name: string;
    avatar: string;
    phone?: string;
    access_token?: string;
    accountType?: "LOCAL" | "GOOGLE" | string;
    role?: "USER" | "ADMIN" | string;
    age?: number;
    address?: string;
    isDeleted?: boolean;
    isActive?: boolean;
    gender?: "male" | "female" | string;
    codeId?: string;
    codeExpired?: string;
    deletedAt?: string | null;
    createdAt?: string;
    updatedAt?: string;
    __v?: number;
  }
  interface IFetchAccount {
    user: IUser;
  }

  interface IRegister {
    _id: string;
    email: string;
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

  interface IOrder {
    _id: string;
    thumbnail: string;
    fullName: string;
    productName: string;
    phoneNumber: string;
    shippingAddress: string;
    paymentMethod: any;
    userId: string;
    items: {
      productId: string;
      quantity: number;
      price: number;
    }[];
    status: "pending" | "confirmed" | "shipped" | "cancelled";
    totalPrice: number;
    createdAt: string;
    updatedAt: string;
    paymentRef: string;
  }

  interface ICart {
    _id: string;
    quantity: number;
    detail: IProduct;
  }

  interface IBackendRes<T> {
    error?: string | string[];
    fileUploaded: any;
    message: string;
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

  interface ApiResponse<T> {
    data?: {
      result?: T[] | T;
      meta?: {
        current: number;
        pageSize: number;
        total: number;
      };
    };
    statusCode?: number;
    message?: string;
    error?: string;
  }
}
