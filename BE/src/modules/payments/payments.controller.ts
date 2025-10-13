import { Controller, Post, Get, Param, Body, Patch } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post(':orderId')
  create(@Param('orderId') orderId: string, @Body() dto: CreatePaymentDto) {
    return this.paymentsService.create(orderId, dto.method);
  }

  @Get()
  findAll() {
    return this.paymentsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.paymentsService.findOne(id);
  }

  @Patch(':id')
  updateStatus(@Param('id') id: string, @Body() dto: UpdatePaymentDto) {
    return this.paymentsService.updateStatus(id, dto.status);
  }
}
