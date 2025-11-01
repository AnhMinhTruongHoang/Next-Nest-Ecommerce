import { PartialType } from '@nestjs/mapped-types';
import { CreateOrderDto } from './create-order.dto';
import { IsEnum, IsOptional } from 'class-validator';

export class UpdateOrderDto extends PartialType(CreateOrderDto) {
  @IsEnum(['PENDING', 'PAID', 'SHIPPED', 'COMPLETED', 'CANCELED', 'REFUNDED'])
  @IsOptional()
  status?:
    | 'PENDING'
    | 'PAID'
    | 'SHIPPED'
    | 'COMPLETED'
    | 'CANCELED'
    | 'REFUNDED';

  @IsEnum(['UNPAID', 'PAID', 'REFUNDED'])
  @IsOptional()
  paymentStatus?: 'UNPAID' | 'PAID' | 'REFUNDED';
}
