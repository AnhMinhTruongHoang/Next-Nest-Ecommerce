import { Types } from 'mongoose';

export interface IOrderItem {
  productId: Types.ObjectId;
  quantity: number;
  price: number;
}

export interface IOrder {
  _id?: Types.ObjectId;
  userId: Types.ObjectId;
  items: IOrderItem[];
  totalPrice: number;
  status?: 'PENDING' | 'PAID' | 'SHIPPED' | 'COMPLETED' | 'CANCELED'; // optional
  paymentMethod?: 'COD' | 'BANK' | 'MOMO';
  paymentStatus?: 'UNPAID' | 'PAID' | 'REFUNDED';
  shippingAddress?: string;
  phoneNumber?: string;
  isDeleted?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
}
