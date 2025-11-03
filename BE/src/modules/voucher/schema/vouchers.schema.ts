import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type VoucherDocument = HydratedDocument<Voucher>;

@Schema({ timestamps: true })
export class Voucher {
  @Prop({ required: true, unique: true, lowercase: true, trim: true })
  code: string;

  @Prop({ required: true, enum: ['PERCENT', 'AMOUNT'] })
  type: 'PERCENT' | 'AMOUNT';

  @Prop({ required: true, min: 0 })
  amount: number;

  @Prop({ type: Number, min: 0, default: 0 })
  maxDiscount?: number;

  @Prop({ type: Number, min: 0, default: 0 })
  minOrder?: number;

  @Prop({ type: Date, default: null })
  startAt?: Date | null;

  @Prop({ type: Date, default: null })
  endAt?: Date | null;

  @Prop({ default: true })
  isActive: boolean;

  // đếm lượt dùng, tăng khi order PAID (không tăng ở preview)
  @Prop({ default: 0, min: 0 })
  usedCount: number;

  // 0 = không giới hạn
  @Prop({ default: 0, min: 0 })
  totalUses: number;

  // 0 = không giới hạn/1 user (chưa dùng ở bản đơn giản này)
  @Prop({ default: 0, min: 0 })
  userUsageLimit: number;

  // ----- PHẠM VI CHO PHÉP -----
  @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: 'Product', default: [] })
  allowedProductIds: mongoose.Types.ObjectId[];

  @Prop({
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Category',
    default: [],
  })
  allowedCategoryIds: mongoose.Types.ObjectId[];

  @Prop({ type: [String], default: [] })
  allowedBrands: string[];

  // ----- PHẠM VI CẤM -----
  @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: 'Product', default: [] })
  bannedProductIds: mongoose.Types.ObjectId[];

  @Prop({
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'Category',
    default: [],
  })
  bannedCategoryIds: mongoose.Types.ObjectId[];

  @Prop({ type: [String], default: [] })
  bannedBrands: string[];

  // ----- SOFT DELETE -----
  @Prop({ type: Boolean, default: false })
  isDeleted: boolean;

  @Prop({ type: Date, default: null })
  deletedAt?: Date | null;
}

export const VoucherSchema = SchemaFactory.createForClass(Voucher);
VoucherSchema.index({ code: 1 }, { unique: true });
