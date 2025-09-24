export interface Product {
  _id?: string;
  name: string;
  description?: string;
  brand: string;
  price: number;
  stock?: number;
  sold?: number;
  thumbnail: string;
  images?: string[];
  isDeleted?: boolean;
  category: string;

  createdBy?: {
    _id: string;
    email: string;
  };
  updatedBy?: {
    _id: string;
    email: string;
  };
  deletedBy?: {
    _id: string;
    email: string;
  };
  deletedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}
