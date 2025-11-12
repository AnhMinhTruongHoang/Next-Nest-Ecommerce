import { IsIn, IsOptional, IsISO8601 } from 'class-validator';

export class GetOverviewDto {
  @IsIn(['monthly', 'yearly'])
  timeFrame: 'monthly' | 'yearly';

  @IsOptional() @IsISO8601() from?: string;
  @IsOptional() @IsISO8601() to?: string;
}
