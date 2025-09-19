import mongoose from 'mongoose';

export interface IReview {
  _id?: mongoose.Types.ObjectId;
  userId: mongoose.Types.ObjectId;
  productId: mongoose.Types.ObjectId;
  rating: number; // 1-5
  comment?: string;
  createdAt?: Date;
  updatedAt?: Date;
  isDeleted?: boolean;
  deletedAt?: Date;
  createdBy?: { _id: mongoose.Types.ObjectId; email: string };
  updatedBy?: { _id: mongoose.Types.ObjectId; email: string };
  deletedBy?: { _id: mongoose.Types.ObjectId; email: string };
}
