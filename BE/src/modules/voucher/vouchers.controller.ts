import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { VouchersService } from './vouchers.service';
import { PreviewVoucherDto } from './dto/preview-voucher.dto';
import { CreateVoucherDto } from './dto/create-vouchers.dto';
import { UpdateVoucherDto } from './dto/update-vouchers.dto';

@Controller('vouchers')
export class VouchersController {
  constructor(private readonly vouchersService: VouchersService) {}

  @Post()
  create(@Body() dto: CreateVoucherDto) {
    return this.vouchersService.create(dto);
  }

  @Get()
  findAll(
    @Query('current') current?: string,
    @Query('pageSize') pageSize?: string,
    @Query() qs?: any,
  ) {
    const c = Number(current) || 1;
    const l = Number(pageSize) || 10;
    return this.vouchersService.findAll(c, l, qs);
  }

  @Get('code/:code')
  findByCode(@Param('code') code: string) {
    return this.vouchersService.findByCode(code);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.vouchersService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateVoucherDto) {
    return this.vouchersService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.vouchersService.remove(id);
  }

  @Post('preview')
  preview(@Body() dto: PreviewVoucherDto) {
    return this.vouchersService.preview(dto);
  }
}
