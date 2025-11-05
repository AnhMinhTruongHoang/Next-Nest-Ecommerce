// dto/create-membership.dto.ts
import {
  IsBoolean,
  IsIn,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Max,
  Min,
  ValidateIf,
} from 'class-validator';
import { IsGte } from './is-gte.decorator';

export class CreateMembershipDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNumber()
  @Min(0)
  @Max(100)
  discountRate: number;

  @IsNumber()
  @Min(0)
  pointMultiplier: number;

  @IsBoolean()
  freeShipping: boolean;

  @IsNumber()
  @Min(0)
  monthlyFee: number;

  @IsNumber()
  @Min(0)
  minSpend: number;

  @ValidateIf((o) => o.maxSpend !== undefined)
  @IsNumber()
  @Min(0)
  @IsGte('minSpend', { message: 'maxSpend must be >= minSpend' })
  maxSpend?: number;
}
