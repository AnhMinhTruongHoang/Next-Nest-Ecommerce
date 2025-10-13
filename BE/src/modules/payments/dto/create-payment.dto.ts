import {
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';
import { PaymentMethod, PaymentStatus } from '../schema/payment.schema';

export class CreatePaymentDto {
  @IsMongoId()
  @IsNotEmpty()
  orderId: string;

  @IsNumber()
  @IsPositive()
  amount: number;

  @IsEnum(PaymentMethod)
  method: PaymentMethod;

  @IsOptional()
  @IsEnum(PaymentStatus)
  status?: PaymentStatus;

  @IsOptional()
  @IsString()
  transactionId?: string;
}
