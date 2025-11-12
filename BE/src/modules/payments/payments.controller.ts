import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  Patch,
  Query,
} from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UpdatePaymentDto } from './dto/update-payment.dto';
import { GetOverviewDto } from './dto/get-overview.dto';

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

  @Get('overview')
  async getOverview(
    @Query('timeFrame') timeFrame: 'monthly' | 'yearly' = 'monthly',
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    return this.paymentsService.getOverview({ timeFrame, from, to });
  }
}
