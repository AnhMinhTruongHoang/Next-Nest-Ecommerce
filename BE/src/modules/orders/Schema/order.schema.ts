import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type OrderDocument = HydratedDocument<Order>;

@Schema({ timestamps: true })
export class Order {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  userId: mongoose.Types.ObjectId;

  @Prop([
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
      },
      quantity: { type: Number, required: true, min: 1 },
      price: { type: Number, required: true, min: 0 },
    },
  ])
  items: {
    productId: mongoose.Types.ObjectId;
    quantity: number;
    price: number;
  }[];

  @Prop({
    default: 'PENDING',
    enum: ['PENDING', 'PAID', 'SHIPPED', 'COMPLETED', 'CANCELED'],
  })
  status: string;

  @Prop({ required: true, min: 0 })
  totalPrice: number;

  @Prop()
  shippingAddress: string;

  @Prop()
  phoneNumber: string;

  @Prop({ enum: ['COD', 'BANK', 'MOMO'], default: 'COD' })
  paymentMethod: string;

  @Prop({ enum: ['UNPAID', 'PAID', 'REFUNDED'], default: 'UNPAID' })
  paymentStatus: string;

  @Prop({ default: false })
  isDeleted: boolean;

  @Prop({ type: Date, default: null })
  deletedAt: Date | null;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
