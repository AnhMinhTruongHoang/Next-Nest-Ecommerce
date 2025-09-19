import mongoose from 'mongoose';

export interface IPayment {
  _id?: mongoose.Types.ObjectId;
  orderId: mongoose.Types.ObjectId;
  amount: number;
  method: 'credit_card' | 'paypal' | 'bank_transfer' | 'cod';
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  transactionId?: string;
  createdAt?: Date;
  updatedAt?: Date;
  isDeleted?: boolean;
  deletedAt?: Date;
  createdBy?: { _id: mongoose.Types.ObjectId; email: string };
  updatedBy?: { _id: mongoose.Types.ObjectId; email: string };
  deletedBy?: { _id: mongoose.Types.ObjectId; email: string };
}
