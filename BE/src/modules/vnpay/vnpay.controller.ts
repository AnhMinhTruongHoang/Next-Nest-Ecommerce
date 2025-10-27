import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
} from '@nestjs/common';
import { VnpayService } from './vnpay.service';
import { CreateVnpayDto } from './dto/create-vnpay.dto';
import { UpdateVnpayDto } from './dto/update-vnpay.dto';
import { Request } from 'express';
import { OrdersService } from '../orders/orders.service';

@Controller('vnpay')
export class VnpayController {
  constructor(
    private readonly vnpayService: VnpayService,
    private readonly orderService: OrdersService,
  ) {}

  @Post('payment-url')
  createPaymentUrl(
    @Body() createVnpayDto: CreateVnpayDto,
    @Req() request: Request,
  ) {
    return this.vnpayService.createUrl(createVnpayDto, request);
  }

  @Get()
  findAll() {
    return this.vnpayService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.vnpayService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateVnpayDto: UpdateVnpayDto) {
    return this.vnpayService.update(+id, updateVnpayDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.vnpayService.remove(+id);
  }

  @Get('return-url')
  async vnpayReturn(@Req() req: Request) {
    const result = this.vnpayService.verifyReturn(req.query);

    const orderId = result.data?.vnp_TxnRef;

    if (result.isValid && result.data.vnp_ResponseCode === '00') {
      await this.orderService.updateStatus(orderId, 'PAID');
      return { message: 'Thanh toán thành công', orderId };
    } else {
      await this.orderService.updateStatus(orderId, 'FAILED');
      return { message: 'Thanh toán thất bại hoặc sai chữ ký', orderId };
    }
  }
}
