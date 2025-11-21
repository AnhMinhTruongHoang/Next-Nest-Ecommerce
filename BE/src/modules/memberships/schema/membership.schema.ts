import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type MembershipDocument = HydratedDocument<Membership>;

@Schema({ timestamps: true })
export class Membership {
  @Prop({ required: true, unique: true })
  name: string;

  @Prop()
  description: string;

  @Prop({ default: 0, min: 0, max: 100 })
  discountRate: number;

  @Prop({ default: 1, min: 0 })
  pointMultiplier: number;

  @Prop({ default: false })
  freeShipping: boolean;

  @Prop({ default: 0, min: 0 })
  monthlyFee: number;

  @Prop({ min: 0, default: 0 })
  minSpend: number;

  @Prop({ required: false, min: 0 })
  maxSpend?: number;

  @Prop({ type: Object })
  createdBy?: { _id: mongoose.Schema.Types.ObjectId; email: string };

  @Prop({ type: Object })
  updatedBy?: { _id: mongoose.Schema.Types.ObjectId; email: string };

  @Prop()
  deletedAt?: Date;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;

  @Prop({ type: Object })
  deletedBy?: { _id: mongoose.Schema.Types.ObjectId; email: string };
}

export const MembershipSchema = SchemaFactory.createForClass(Membership);
