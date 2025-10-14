import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { Order, OrderDocument } from './Schema/order.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import aqp from 'api-query-params';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private orderModel: SoftDeleteModel<OrderDocument>,
  ) {}

  // CREATE
  async create(data: CreateOrderDto) {
    const items = data.items.map((item) => ({
      ...item,
      productId: new Types.ObjectId(item.productId),
    }));

    const totalPrice = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );

    const created = new this.orderModel({
      ...data,
      userId: new Types.ObjectId(data.userId),
      items,
      totalPrice,
      status: data.status ?? 'PENDING',
      paymentMethod: data.paymentMethod ?? 'COD',
      paymentStatus: data.paymentStatus ?? 'UNPAID',
    });

    return created.save();
  }

  // FIND ALL with pagination, filtering, sorting
  async findAll(currentPage: number, limit: number, qs: string) {
    const { filter, sort, population } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;

    const page = Math.max(1, +currentPage || 1);
    const defaultLimit = Math.max(1, +limit || 10);
    const offset = (page - 1) * defaultLimit;

    const totalItems = await this.orderModel.countDocuments(filter);
    const totalPages = Math.ceil(totalItems / defaultLimit);

    const result = await this.orderModel
      .find(filter)
      .skip(offset)
      .limit(defaultLimit)
      .sort(sort as any)
      .populate(population)
      .exec();

    return {
      meta: {
        current: page,
        pageSize: defaultLimit,
        pages: totalPages,
        total: totalItems,
      },
      result,
    };
  }

  // FIND ONE
  async findOne(id: string) {
    const order = await this.orderModel.findById(id).exec();
    if (!order) throw new NotFoundException(`Order ${id} not found`);
    return order;
  }

  // UPDATE
  async update(id: string, data: UpdateOrderDto) {
    const updateData: any = { ...data };

    if (data.userId) {
      updateData.userId = new Types.ObjectId(data.userId);
    }

    if (data.items) {
      updateData.items = data.items.map((item) => ({
        ...item,
        productId: new Types.ObjectId(item.productId),
      }));
      updateData.totalPrice = updateData.items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0,
      );
    }

    const updated = await this.orderModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .exec();

    if (!updated) throw new NotFoundException(`Order ${id} not found`);
    return updated;
  }

  // SOFT DELETE
  async remove(id: string) {
    const deleted = await this.orderModel
      .findByIdAndUpdate(
        id,
        { isDeleted: true, deletedAt: new Date() },
        { new: true },
      )
      .exec();

    if (!deleted) throw new NotFoundException(`Order ${id} not found`);
    return deleted;
  }
}
