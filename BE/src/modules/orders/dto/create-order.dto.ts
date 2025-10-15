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
  @IsMongoId()
  userId?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];

  @IsEnum(['PENDING', 'PAID', 'SHIPPED', 'COMPLETED', 'CANCELED'])
  @IsOptional()
  status?: 'PENDING' | 'PAID' | 'SHIPPED' | 'COMPLETED' | 'CANCELED';

  @IsNumber()
  @Min(0)
  totalPrice: number;

  @IsNotEmpty()
  @IsString()
  shippingAddress?: string;

  @IsNotEmpty()
  phoneNumber?: string;

  @IsEnum(['COD', 'BANK', 'MOMO'])
  @IsOptional()
  paymentMethod?: 'COD' | 'BANK' | 'MOMO';

  @IsEnum(['UNPAID', 'PAID', 'REFUNDED'])
  @IsOptional()
  paymentStatus?: 'UNPAID' | 'PAID' | 'REFUNDED';
}
