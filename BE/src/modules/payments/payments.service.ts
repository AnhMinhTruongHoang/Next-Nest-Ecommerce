import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, PipelineStage } from 'mongoose';

import {
  Payment,
  PaymentDocument,
  PaymentStatus,
} from './schema/payment.schema';
import { Order, OrderDocument } from '../orders/schema/order.schema';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectModel(Payment.name) private paymentModel: Model<PaymentDocument>,
    @InjectModel(Order.name) private orderModel: Model<OrderDocument>,
  ) {}

  async create(orderId: string, method: string) {
    const order = await this.orderModel.findById(orderId);
    if (!order) throw new NotFoundException('Order not found');

    const payment = new this.paymentModel({
      orderId: order._id,
      amount: order.totalPrice,
      method,
      status: PaymentStatus.PENDING,
    });
    return payment.save();
  }

  async findAll() {
    return this.paymentModel.find().populate('orderId').exec();
  }

  async findOne(id: string) {
    const payment = await this.paymentModel.findById(id).populate('orderId');
    if (!payment) throw new NotFoundException('Payment not found');
    return payment;
  }

  async updateStatus(id: string, status: PaymentStatus) {
    const payment = await this.paymentModel.findByIdAndUpdate(
      id,
      { status },
      { new: true },
    );
    if (!payment) throw new NotFoundException('Payment not found');

    if (status === PaymentStatus.PAID) {
      await this.orderModel.findByIdAndUpdate(payment.orderId, {
        status: 'confirmed',
      });
    }

    return payment;
  }

  /// dashboard
  async getOverview(params: {
    timeFrame?: 'monthly' | 'yearly';
    from?: string;
    to?: string;
  }) {
    const { timeFrame = 'monthly', from, to } = params;

    // ----- $match -----
    const match: Record<string, any> = {};
    if (from || to) {
      match.createdAt = {};
      if (from) match.createdAt.$gte = new Date(from);
      if (to) match.createdAt.$lte = new Date(to);
    }

    // YYYY hoặc YYYY-MM
    const format = timeFrame === 'yearly' ? '%Y' : '%Y-%m';

    const pipeline: PipelineStage[] = [
      { $match: match } as PipelineStage,
      {
        $group: {
          _id: {
            period: { $dateToString: { format, date: '$createdAt' } },
            status: '$status',
          },
          total: { $sum: '$amount' },
        },
      } as PipelineStage,
      { $sort: { '_id.period': 1 } } as PipelineStage,
    ];

    const rows = await this.paymentModel.aggregate(pipeline);

    // ----- Transform kết quả -----
    if (timeFrame === 'yearly') {
      // period = '2023'
      const bucket = new Map<string, { received: number; due: number }>();

      for (const r of rows) {
        const period = r._id.period as string; // 'YYYY'
        const isPaid = r._id.status === PaymentStatus.PAID;
        const entry = bucket.get(period) ?? { received: 0, due: 0 };
        if (isPaid) entry.received += r.total;
        else entry.due += r.total;
        bucket.set(period, entry);
      }

      const years = Array.from(bucket.keys()).sort();
      return {
        received: years.map((p) => ({
          x: Number(p),
          y: bucket.get(p)!.received,
        })),
        due: years.map((p) => ({ x: Number(p), y: bucket.get(p)!.due })),
      };
    }

    // monthly: period = '2025-01' .. '2025-12'
    const monthBuckets = Array.from({ length: 12 }, (_, i) => ({
      month: i + 1,
      received: 0,
      due: 0,
    }));

    for (const r of rows) {
      const period = r._id.period as string; // 'YYYY-MM'
      const month = Number(period.split('-')[1]); // 1..12 (nếu thiếu, bỏ qua)
      if (!Number.isFinite(month) || month < 1 || month > 12) continue;

      const isPaid = r._id.status === PaymentStatus.PAID;
      const idx = month - 1;
      if (isPaid) monthBuckets[idx].received += r.total;
      else monthBuckets[idx].due += r.total;
    }

    return {
      received: monthBuckets.map((b, i) => ({
        x: `Th${i + 1}`,
        y: b.received,
      })),
      due: monthBuckets.map((b, i) => ({ x: `Th${i + 1}`, y: b.due })),
    };
  }
}
