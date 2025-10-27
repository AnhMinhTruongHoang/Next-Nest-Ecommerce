import { PartialType } from '@nestjs/mapped-types';
import { CreateVnpayDto } from './create-vnpay.dto';

export class UpdateVnpayDto extends PartialType(CreateVnpayDto) {}
