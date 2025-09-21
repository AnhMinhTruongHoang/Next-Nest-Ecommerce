import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PaymentsService } from './payments.service';
import { PaymentsController } from './payments.controller';
import { Payment, PaymentSchema } from './schema/payment.schema';
import { OrdersModule } from '../orders/orders.module'; // 👈 lấy từ đây

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Payment.name, schema: PaymentSchema }]),
    OrdersModule,
  ],
  controllers: [PaymentsController],
  providers: [PaymentsService],
  exports: [MongooseModule, PaymentsService],
})
export class PaymentsModule {}
