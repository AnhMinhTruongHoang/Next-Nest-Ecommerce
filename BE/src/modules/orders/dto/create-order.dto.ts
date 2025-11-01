import {
  IsArray,
  IsEnum,
  IsMongoId,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  isString,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

class OrderItemDto {
  @IsMongoId()
  @IsNotEmpty()
  productId: string;

  @IsNumber()
  @IsPositive()
  quantity: number;

  @IsNumber()
  @Min(0)
  price: number;
}

export class CreateOrderDto {
  @IsOptional()
  @IsString()
  userId?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];

  @IsEnum(['PENDING', 'PAID', 'SHIPPED', 'COMPLETED', 'CANCELED', 'REFUNDED'])
  @IsOptional()
  status?:
    | 'PENDING'
    | 'PAID'
    | 'SHIPPED'
    | 'COMPLETED'
    | 'CANCELED'
    | 'REFUNDED';

  @IsNumber()
  @Min(0)
  totalPrice: number;

  @IsNotEmpty()
  @IsString()
  fullName: string;

  @IsNotEmpty()
  @IsString()
  shippingAddress: string;

  @IsNotEmpty()
  @IsString()
  phoneNumber: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsString()
  note?: string;

  @IsOptional()
  paymentRef?: string;

  @IsEnum(['COD', 'BANK', 'MOMO', 'VNPAY'])
  @IsOptional()
  paymentMethod?: 'COD' | 'BANK' | 'MOMO' | 'VNPAY';

  @IsEnum(['UNPAID', 'PAID', 'REFUNDED'])
  @IsOptional()
  paymentStatus?: 'UNPAID' | 'PAID' | 'REFUNDED';
}
