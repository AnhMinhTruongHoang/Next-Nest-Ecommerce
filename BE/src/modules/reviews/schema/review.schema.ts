import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';
import { softDeletePlugin } from 'soft-delete-plugin-mongoose';

export type ReviewDocument = HydratedDocument<Review>;

@Schema({ timestamps: true, versionKey: false })
export class Review {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true })
  userId: mongoose.Types.ObjectId;

  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  })
  productId: mongoose.Types.ObjectId;

  @Prop({ type: Number, required: true, min: 1, max: 5 })
  rating: number;

  @Prop({ type: String, trim: true, maxlength: 4000 })
  comment?: string;

  @Prop({ default: false }) isDeleted: boolean;
  @Prop() deletedAt?: Date;

  @Prop({ type: Object }) createdBy?: {
    _id: mongoose.Types.ObjectId;
    email: string;
  };
  @Prop({ type: Object }) updatedBy?: {
    _id: mongoose.Types.ObjectId;
    email: string;
  };
  @Prop({ type: Object }) deletedBy?: {
    _id: mongoose.Types.ObjectId;
    email: string;
  };
}

export const ReviewSchema = SchemaFactory.createForClass(Review);

ReviewSchema.index(
  { productId: 1, userId: 1 },
  { unique: true, partialFilterExpression: { isDeleted: { $eq: false } } },
);
ReviewSchema.index({ productId: 1, createdAt: -1 });
ReviewSchema.index({ userId: 1, createdAt: -1 });

ReviewSchema.plugin(softDeletePlugin);
