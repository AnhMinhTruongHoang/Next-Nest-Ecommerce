import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

import { DatabasesService } from './databases.service';
import { DatabasesController } from './databases.controller';

import { UsersModule } from '../users/users.module';

// ======= SCHEMAS mà DatabasesService inject =======
import { User, UserSchema } from '../users/schemas/user.schema';
import {
  Membership,
  MembershipSchema,
} from '../memberships/schema/membership.schema';
import { Category, CategorySchema } from '../categories/schema/category.schema';
import { Product, ProductSchema } from '../products/schema/product.schema';
import { Order, OrderSchema } from '../orders/schema/order.schema';
import { Payment, PaymentSchema } from '../payments/schema/payment.schema';
import { Voucher, VoucherSchema } from '../voucher/schema/vouchers.schema';

@Module({
  imports: [
    ConfigModule,
    UsersModule,

    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Membership.name, schema: MembershipSchema },
      { name: Category.name, schema: CategorySchema },
      { name: Product.name, schema: ProductSchema },
      { name: Order.name, schema: OrderSchema },
      { name: Payment.name, schema: PaymentSchema },
      { name: Voucher.name, schema: VoucherSchema },
    ]),
  ],
  controllers: [DatabasesController],
  providers: [DatabasesService],
  exports: [DatabasesService],
})
export class DatabasesModule {}
