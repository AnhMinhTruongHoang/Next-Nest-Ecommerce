import { Types } from 'mongoose';

export interface IOrderItem {
  productId: Types.ObjectId;
  quantity: number;
  price: number;
}

export interface IOrder {
  _id?: Types.ObjectId;
  user: Types.ObjectId;
  items: IOrderItem[];
  totalPrice: number;
  status: 'PENDING' | 'PAID' | 'SHIPPED' | 'COMPLETED' | 'CANCELED';
  paymentMethod: 'COD' | 'BANK' | 'MOMO';
  shippingAddress: string;
  isDeleted?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
  createdBy?: { _id: Types.ObjectId; email: string };
  updatedBy?: { _id: Types.ObjectId; email: string };
  deletedBy?: { _id: Types.ObjectId; email: string };
}
