import mongoose from 'mongoose';

export interface ICart {
  _id?: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  items: {
    productId: mongoose.Types.ObjectId;
    quantity: number;
  }[];
  totalPrice: number;
  createdAt?: Date;
  updatedAt?: Date;
  isDeleted?: boolean;
  deletedAt?: Date;
  createdBy?: { _id: mongoose.Types.ObjectId; email: string };
  updatedBy?: { _id: mongoose.Types.ObjectId; email: string };
  deletedBy?: { _id: mongoose.Types.ObjectId; email: string };
}
