import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Patch,
  Delete,
  Query,
  NotFoundException,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { Public, ResponseMessage } from 'src/health/decorator/customize';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @Public()
  @ResponseMessage('Create new order')
  create(@Body() data: CreateOrderDto) {
    return this.ordersService.create(data);
  }

  @Get()
  @ResponseMessage('Fetch orders with paginate')
  findAll(
    @Query('current') currentPage: string,
    @Query('pageSize') limit: string,
    @Query() qs: string,
  ) {
    return this.ordersService.findAll(+currentPage, +limit, qs);
  }

  @Get('/user/:userId')
  async getOrdersByUser(@Param('userId') userId: string) {
    const orders = await this.ordersService.findOrderByUserId(userId);
    return {
      statusCode: 200,
      message: 'Fetched user orders successfully',
      data: orders ?? [],
    };
  }

  @Get('confirm-payment')
  @Public()
  @ResponseMessage('Confirm VNPay payment')
  confirmPayment(@Query() query: any) {
    return this.ordersService.confirmVNPayPayment(query);
  }

  @Get(':id')
  @ResponseMessage('Fetch order detail')
  findOne(@Param('id') id: string) {
    return this.ordersService.findOne(id);
  }

  @Patch(':id')
  @ResponseMessage('Update order')
  update(@Param('id') id: string, @Body() data: UpdateOrderDto) {
    return this.ordersService.update(id, data);
  }

  @Delete(':id')
  @ResponseMessage('Soft delete order')
  remove(@Param('id') id: string) {
    return this.ordersService.remove(id);
  }
}
