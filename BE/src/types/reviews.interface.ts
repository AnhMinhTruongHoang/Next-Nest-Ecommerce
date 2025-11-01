import { Types } from 'mongoose';

export interface IReview {
  _id?: Types.ObjectId;
  userId: Types.ObjectId;
  productId: Types.ObjectId;
  rating: number;
  comment?: string;
  isDeleted?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
