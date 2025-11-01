// vnpay.controller.ts
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
    console.log('VNPay Return:', result);

    // Đây thực chất là paymentRef bạn đã gán khi tạo order
    const paymentRef = result.data?.vnp_TxnRef;
    console.log('paymentRef (vnp_TxnRef):', paymentRef);

    if (!paymentRef) {
      return { message: 'Thiếu vnp_TxnRef trong phản hồi VNPay' };
    }

    if (result.isValid && result.data.vnp_ResponseCode === '00') {
      // ✅ DÙNG ENUM THAY VÌ CHUỖI
      const updated = await this.orderService.updateStatus(
        paymentRef,
        PaymentStatus.PAID,
      );
      console.log('Update success:', updated);
      return { message: 'Thanh toán thành công', paymentRef };
    } else {
      const updated = await this.orderService.updateStatus(
        paymentRef,
        PaymentStatus.FAILED,
      );
      console.log('Update failed:', updated);
      return { message: 'Thanh toán thất bại hoặc sai chữ ký', paymentRef };
    }
  }
}
