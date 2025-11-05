import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Membership, MembershipSchema } from './schema/membership.schema';
import { MembershipsService } from './memberships.service';
import { MembershipsController } from './memberships.controller';
import { Order, OrderSchema } from '../orders/schema/order.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Membership.name, schema: MembershipSchema },
      { name: Order.name, schema: OrderSchema },
    ]),
  ],
  controllers: [MembershipsController],
  providers: [MembershipsService],
  exports: [MongooseModule, MembershipsService],
})
export class MembershipsModule {}
