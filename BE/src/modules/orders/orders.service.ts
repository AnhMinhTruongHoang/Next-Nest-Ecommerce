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
    const {
      userId,
      fullName,
      items,
      phoneNumber,
      shippingAddress,
      status,
      paymentMethod,
      paymentStatus,
      paymentRef,
    } = data;

    const formattedItems = items.map((item) => ({
      ...item,
      productId: new Types.ObjectId(item.productId),
    }));

    const totalPrice = formattedItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );

    const orderData: any = {
      fullName,
      items: formattedItems,
      totalPrice,
      phoneNumber,
      shippingAddress,
      status: status ?? 'PENDING',
      paymentMethod: paymentMethod ?? 'COD',
      paymentStatus: paymentStatus ?? 'UNPAID',
      paymentRef,
    };

    // chỉ gán userId nếu hợp lệ (đã login)
    if (userId && Types.ObjectId.isValid(userId)) {
      orderData.userId = new Types.ObjectId(userId);
    }

    const created = new this.orderModel(orderData);
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

  async findOrderByUserId(userId: string) {
    const orders = await this.orderModel
      .find({ userId: new Types.ObjectId(userId), isDeleted: false })
      .populate({
        path: 'items.productId',
        select: '_id name price thumbnail',
      })
      .sort({ createdAt: -1 })
      .exec();

    if (!orders || orders.length === 0) {
      throw new NotFoundException(`No orders found for user ${userId}`);
    }

    return orders;
  }

  // FIND ONE
  async findOne(id: string) {
    const order = await this.orderModel
      .findById(id)
      .populate({
        path: 'items.productId',
        select: '_id name price thumbnail',
      })
      .exec();

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

  // UPDATE STATUS
  async updateStatus(paymentRef: string, status: 'PAID' | 'FAILED') {
    const updated = await this.orderModel
      .findOneAndUpdate(
        { paymentRef },
        {
          status,
          paymentStatus: status === 'PAID' ? 'PAID' : 'UNPAID',
        },
        { new: true },
      )
      .exec();

    if (!updated)
      throw new NotFoundException(
        `Order with paymentRef ${paymentRef} not found`,
      );
    return updated;
  }

  ///

  async confirmVNPayPayment(query: any) {
    const { vnp_SecureHash, vnp_TxnRef, vnp_ResponseCode } = query;

    const status = vnp_ResponseCode === '00' ? 'PAID' : 'FAILED';
    return this.updateStatus(vnp_TxnRef, status);
  }
}
