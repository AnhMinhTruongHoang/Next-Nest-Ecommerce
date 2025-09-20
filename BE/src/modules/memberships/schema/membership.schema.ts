import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type MembershipDocument = HydratedDocument<Membership>;

@Schema({ timestamps: true })
export class Membership {
  @Prop({ required: true, unique: true })
  name: string; // Bronze, Silver, Gold

  @Prop()
  description: string;

  @Prop({ default: 0 })
  discountRate: number; // % giảm giá

  @Prop({ default: 0 })
  pointMultiplier: number; // hệ số tích điểm

  @Prop({ default: false })
  freeShipping: boolean;

  @Prop({ default: 0 })
  monthlyFee: number; // nếu là gói trả phí
  ///

  @Prop()
  createdAt: Date;

  @Prop({ type: Object })
  createdBy: {
    _id: mongoose.Schema.Types.ObjectId;
    email: string;
  };

  @Prop()
  updatedAt: Date;

  @Prop({ type: Object })
  updatedBy: {
    _id: mongoose.Schema.Types.ObjectId;
    email: string;
  };

  @Prop()
  deletedAt: Date;

  @Prop({ type: Object })
  deletedBy: {
    _id: mongoose.Schema.Types.ObjectId;
    email: string;
  };
}

export const MembershipSchema = SchemaFactory.createForClass(Membership);
