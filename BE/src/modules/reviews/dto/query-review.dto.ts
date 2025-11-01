import { IsInt, IsMongoId, IsOptional, IsIn, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class QueryReviewDto {
  @IsOptional()
  @IsMongoId()
  productId?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 10;

  // recent | high | low
  @IsOptional()
  @IsIn(['recent', 'high', 'low'])
  sort?: 'recent' | 'high' | 'low' = 'recent';

  // lọc theo số sao cụ thể (1..5)
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  star?: number;
}
