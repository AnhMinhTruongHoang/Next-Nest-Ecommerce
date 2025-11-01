import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model, Types } from 'mongoose';
import { Order, OrderDocument } from './Schema/order.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import aqp from 'api-query-params';
import { Product, ProductDocument } from '../products/schema/product.schema';
import { PaymentStatus } from '../payments/schema/payment.schema';

@Injectable()
export class OrdersService {
  constructor(
    @InjectModel(Order.name) private orderModel: SoftDeleteModel<OrderDocument>,
    @InjectModel(Product.name) private productModel: Model<ProductDocument>,
    @InjectConnection() private readonly connection: Connection,
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

    return orders || [];
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
  // UPDATE
  async update(id: string, data: UpdateOrderDto) {
    const current = await this.orderModel.findById(id).exec();
    if (!current) throw new NotFoundException('Order not found');

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

    // trạng thái trước & sau
    const prevAdjusted = !!current.inventoryAdjusted;
    const nextStatus = updateData.status ?? current.status;
    const nextPaymentStatus = updateData.paymentStatus ?? current.paymentStatus;

    const willBePaid = nextStatus === 'PAID' || nextPaymentStatus === 'PAID';

    const willBeRefundedOrCanceled =
      nextStatus === 'REFUNDED' ||
      nextPaymentStatus === 'REFUNDED' ||
      nextStatus === 'CANCELED';

    // Nếu không có side-effect kho → update thường
    if (
      (!willBePaid && !willBeRefundedOrCanceled) ||
      (willBePaid && prevAdjusted) || // đã trừ kho rồi mà lại set PAID nữa → bỏ qua
      (willBeRefundedOrCanceled && !prevAdjusted) // chưa trừ kho mà refund/cancel → bỏ qua
    ) {
      const updated = await this.orderModel
        .findByIdAndUpdate(id, updateData, { new: true })
        .exec();
      if (!updated) throw new NotFoundException('Order not found');
      return updated;
    }

    // Cần tác động kho → transaction
    const session = await this.connection.startSession();
    session.startTransaction();
    try {
      // 1) ghi order trước, đồng thời toggle cờ inventoryAdjusted phù hợp
      const toggle: Partial<Order> = {};
      if (willBePaid && !prevAdjusted)
        toggle['inventoryAdjusted'] = true as any;
      if (willBeRefundedOrCanceled && prevAdjusted)
        toggle['inventoryAdjusted'] = false as any;

      const updated = await this.orderModel
        .findByIdAndUpdate(
          id,
          { ...updateData, ...toggle },
          { new: true, session },
        )
        .exec();
      if (!updated) throw new NotFoundException('Order not found');

      // 2) tác động kho
      if (willBePaid && !prevAdjusted) {
        // trừ kho + cộng sold
        await this.adjustInventoryForOrder(updated, session);
      }

      if (willBeRefundedOrCanceled && prevAdjusted) {
        // hoàn kho + giảm sold (không âm)
        for (const it of updated.items) {
          const pid = new Types.ObjectId(String(it.productId));

          const prod = await this.productModel.findById(pid).session(session);
          if (!prod) {
            throw new BadRequestException(`Product ${it.productId} not found`);
          }

          const newSold = Math.max((prod.sold ?? 0) - it.quantity, 0);
          const newStock = (prod.stock ?? 0) + it.quantity;

          await this.productModel.updateOne(
            { _id: pid },
            { $set: { stock: newStock, sold: newSold } },
            { session },
          );
        }
      }

      await session.commitTransaction();
      return updated;
    } catch (e) {
      await session.abortTransaction();
      throw e;
    } finally {
      session.endSession();
    }
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
  // orders.service.ts
  async updateStatus(paymentRef: string, status: PaymentStatus) {
    const session = await this.connection.startSession();
    session.startTransaction();
    try {
      const order = await this.orderModel
        .findOne({ paymentRef })
        .session(session);
      if (!order)
        throw new NotFoundException(
          `Order with paymentRef ${paymentRef} not found`,
        );

      if (status === PaymentStatus.PAID) {
        // set trạng thái đơn
        order.paymentStatus = 'PAID';
        order.status = 'PAID';
        await order.save({ session });

        // chỉ trừ kho nếu CHƯA trừ
        if (!order.inventoryAdjusted) {
          await this.adjustInventoryForOrder(order, session);
          await this.orderModel.updateOne(
            { _id: order._id },
            { $set: { inventoryAdjusted: true } },
            { session },
          );
        }
      } else if (status === PaymentStatus.REFUNDED) {
        order.paymentStatus = 'REFUNDED';
        order.status = 'REFUNDED';
        await order.save({ session });

        if (order.inventoryAdjusted) {
          for (const it of order.items) {
            const pid = new Types.ObjectId(String(it.productId));
            // Lấy product hiện tại để trừ sold chính xác
            const prod = await this.productModel.findById(pid).session(session);
            if (!prod)
              throw new BadRequestException(
                `Product ${it.productId} not found`,
              );

            // Tính toán mới
            const newSold = Math.max((prod.sold ?? 0) - it.quantity, 0);
            const newStock = (prod.stock ?? 0) + it.quantity;

            await this.productModel.updateOne(
              { _id: pid },
              { $set: { stock: newStock, sold: newSold } },
              { session },
            );
          }

          // Reset flag đã trừ kho
          await this.orderModel.updateOne(
            { _id: order._id },
            { $set: { inventoryAdjusted: false } },
            { session },
          );
        }
      } else {
        // FAILED hoặc các trạng thái không ảnh hưởng kho
        order.paymentStatus = 'UNPAID';
        await order.save({ session });
      }

      await session.commitTransaction();
      return order;
    } catch (e) {
      await session.abortTransaction();
      throw e;
    } finally {
      session.endSession();
    }
  }

  // VNPay callback → enum, không dùng string thô
  async confirmVNPayPayment(query: any) {
    const { vnp_TxnRef, vnp_ResponseCode } = query;
    const status: PaymentStatus =
      vnp_ResponseCode === '00' ? PaymentStatus.PAID : PaymentStatus.FAILED;

    return this.updateStatus(vnp_TxnRef, status);
  }

  //// COD update paid
  private async adjustInventoryForOrder(order: OrderDocument, session?: any) {
    for (const it of order.items) {
      const pid = new Types.ObjectId(String(it.productId));
      const updated = await this.productModel
        .findOneAndUpdate(
          {
            _id: pid,
            isDeleted: { $ne: true },
            stock: { $gte: it.quantity },
          },
          { $inc: { stock: -it.quantity, sold: +it.quantity } },
          { new: true, session },
        )
        .exec();

      if (!updated) {
        throw new BadRequestException(
          `Not enough stock for product ${it.productId}`,
        );
      }
    }
  }
}
