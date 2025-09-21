import { Controller, Post, Get, Param, Body, Patch } from '@nestjs/common';
import { PaymentsService } from './payments.service';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post(':orderId')
  create(@Param('orderId') orderId: string, @Body('method') method: string) {
    return this.paymentsService.create(orderId, method);
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
  updateStatus(@Param('id') id: string, @Body('status') status: string) {
    return this.paymentsService.updateStatus(id, status);
  }
}
