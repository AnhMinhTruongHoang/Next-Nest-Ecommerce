import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsEnum,
  IsMongoId,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class CreateVoucherDto {
  @IsString()
  @Transform(({ value }) =>
    String(value || '')
      .trim()
      .toLowerCase(),
  )
  code: string;

  @IsEnum(['PERCENT', 'AMOUNT'])
  type: 'PERCENT' | 'AMOUNT';

  @Type(() => Number)
  @IsNumber()
  @Min(0)
  amount: number; // nếu PERCENT -> 1..100; nếu AMOUNT -> >=0 (ràng buộc chi tiết có thể bổ sung sau)

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  maxDiscount?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  minOrder?: number;

  @IsOptional()
  @IsDateString()
  startAt?: string;

  @IsOptional()
  @IsDateString()
  endAt?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  totalUses?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  userUsageLimit?: number;

  // scopes
  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  allowedProductIds?: string[];

  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  allowedCategoryIds?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Transform(({ value }) =>
    Array.isArray(value) ? value.map((s: any) => String(s).toLowerCase()) : [],
  )
  allowedBrands?: string[];

  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  bannedProductIds?: string[];

  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  bannedCategoryIds?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Transform(({ value }) =>
    Array.isArray(value) ? value.map((s: any) => String(s).toLowerCase()) : [],
  )
  bannedBrands?: string[];
}
