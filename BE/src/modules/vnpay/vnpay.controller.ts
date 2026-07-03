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
import { PaymentStatus } from '../payments/schema/payment.schema';

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

  // IMPORTANT: đặt return-url trước :id
  @Get('return-url')
  async vnpayReturn(@Req() req: Request) {
    const result = this.vnpayService.verifyReturn({ ...req.query });

    console.log('VNPay Return:', result);

    const paymentRef = result.data?.vnp_TxnRef;
    console.log('paymentRef (vnp_TxnRef):', paymentRef);

    if (!paymentRef) {
      return {
        statusCode: 400,
        message: 'Thiếu vnp_TxnRef trong phản hồi VNPay',
      };
    }

    if (result.isValid && result.data.vnp_ResponseCode === '00') {
      const updated = await this.orderService.updateStatus(
        paymentRef,
        PaymentStatus.PAID,
      );

      console.log('Update success:', updated);

      return {
        statusCode: 200,
        message: 'Thanh toán thành công',
        paymentRef,
        data: result.data,
      };
    }

    const updated = await this.orderService.updateStatus(
      paymentRef,
      PaymentStatus.FAILED,
    );

    console.log('Update failed:', updated);

    return {
      statusCode: 400,
      message: 'Thanh toán thất bại hoặc sai chữ ký',
      paymentRef,
      data: result.data,
    };
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
}
