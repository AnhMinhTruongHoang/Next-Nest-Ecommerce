import { PartialType } from '@nestjs/mapped-types';
import { IsBoolean, IsOptional } from 'class-validator';
import { CreateVoucherDto } from './create-vouchers.dto';

export class UpdateVoucherDto extends PartialType(CreateVoucherDto) {
  @IsOptional()
  @IsBoolean()
  isDeleted?: boolean;
}
