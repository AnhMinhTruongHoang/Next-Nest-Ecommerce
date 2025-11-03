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

  @Prop({ default: 0, min: 0 })
  usedCount: number;

  @Prop({ default: 0, min: 0 })
  totalUses: number;

  @Prop({ default: 0, min: 0 })
  userUsageLimit: number;

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

  @Prop({ type: Boolean, default: false })
  isDeleted: boolean;

  @Prop({ type: Date, default: null })
  deletedAt?: Date | null;
}
export const VoucherSchema = SchemaFactory.createForClass(Voucher);
VoucherSchema.index({ code: 1 }, { unique: true });
