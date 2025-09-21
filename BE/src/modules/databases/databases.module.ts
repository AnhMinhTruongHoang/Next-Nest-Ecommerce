import { Module } from '@nestjs/common';
import { DatabasesService } from './databases.service';
import { DatabasesController } from './databases.controller';

import { UsersModule } from '../users/users.module';
import { MembershipsModule } from '../memberships/memberships.module';
import { CategoriesModule } from '../categories/categories.module';
import { ProductsModule } from '../products/products.module';
import { OrdersModule } from '../orders/orders.module';
import { PaymentsModule } from '../payments/payments.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    UsersModule,
    MembershipsModule,
    CategoriesModule,
    ProductsModule,
    OrdersModule,
    PaymentsModule,
  ],
  controllers: [DatabasesController],
  providers: [DatabasesService],
})
export class DatabasesModule {}
