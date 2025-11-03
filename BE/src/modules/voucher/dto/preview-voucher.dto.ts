import {
  IsArray,
  IsMongoId,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class PreviewVoucherDto {
  @IsString()
  @Transform(({ value }) =>
    String(value || '')
      .trim()
      .toLowerCase(),
  )
  code: string;

  @IsOptional()
  @IsMongoId()
  userId?: string;

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  orderSubtotal: number;

  @IsArray()
  @IsMongoId({ each: true })
  productIds: string[];

  @IsArray()
  @IsMongoId({ each: true })
  categoryIds: string[];

  @IsArray()
  @IsString({ each: true })
  @Transform(({ value }) =>
    Array.isArray(value) ? value.map((s: any) => String(s).toLowerCase()) : [],
  )
  brands: string[];
}

export type PreviewVoucherResult = {
  valid: boolean;
  reason?: string;
  discount: number;
  voucher?: any;
};
