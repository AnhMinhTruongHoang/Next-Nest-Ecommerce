export {};
// https://bobbyhadz.com/blog/typescript-make-types-global#declare-global-types-in-typescript

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
    detail: IBookTable;
  }

  interface IBackendRes<T> {
    error?: string | string[];
    message?: string;
    statusCode: number | string;
    data?: T;
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
