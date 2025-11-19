import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';
import { Membership } from 'src/modules/memberships/schema/membership.schema';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  email: string;

  @Prop({ required: false })
  password: string;

  @Prop()
  name: string;

  @Prop()
  age: number;

  @Prop({ trim: true })
  phone: string;

  @Prop()
  gender: string;

  @Prop()
  address: string;

  @Prop({ default: 'LOCAL' })
  accountType: string;

  @Prop({ default: 'USER', enum: ['USER', 'ADMIN'] })
  role: string;

  @Prop()
  avatar: string;

  @Prop({ type: Types.ObjectId, ref: Membership.name })
  membership: Types.ObjectId;

  ////

  @Prop()
  isDeleted: boolean;

  @Prop()
  createdAt: Date;

  @Prop({ type: Object })
  createdBy: {
    _id: mongoose.Schema.Types.ObjectId;
    email: string;
  };

  @Prop({ default: false })
  isActive: boolean;

  @Prop()
  codeId: string;

  @Prop()
  codeExpired: Date;

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

export const UserSchema = SchemaFactory.createForClass(User);
