import { IsNumber, Min } from 'class-validator';

export class PreviewTierDto {
  @IsNumber()
  @Min(0)
  totalSpent: number;
}
