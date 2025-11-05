import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { Model, Types } from 'mongoose';

import { Membership, MembershipDocument } from './schema/membership.schema';
import { Order, OrderDocument } from '../orders/schema/order.schema';

@Injectable()
export class MembershipsService {
  constructor(
    @InjectModel(Membership.name)
    private membershipModel: SoftDeleteModel<MembershipDocument>,

    @InjectModel(Order.name)
    private orderModel: Model<OrderDocument>, // <-- thêm inject
  ) {}

  async create(
    data: Partial<Membership>,
    user: { _id: string; email: string },
  ) {
    const created = new this.membershipModel({
      ...data,
      createdBy: { _id: user._id, email: user.email },
    });
    return created.save();
  }

  async getTierByUser(userId: string) {
    const uid = new Types.ObjectId(userId);
    const orders = await this.orderModel
      .find({ userId: uid, paymentStatus: 'PAID', isDeleted: false })
      .select('totalPrice')
      .lean();

    const totalSpent = orders.reduce(
      (sum, o: any) => sum + (o.totalPrice || 0),
      0,
    );

    const tiers = await this.membershipModel
      .find()
      .sort({ minSpend: 1 })
      .lean();

    const current =
      tiers.find(
        (t: any) =>
          totalSpent >= (t.minSpend ?? 0) &&
          (t.maxSpend == null || totalSpent <= t.maxSpend),
      ) || null;

    const nextTier = tiers.find(
      (t: any) => (t.minSpend ?? 0) > (current?.minSpend ?? 0),
    );

    return {
      totalSpent,
      currentTier: current,
      nextTier: nextTier
        ? {
            name: nextTier.name,
            needMore: (nextTier.minSpend ?? 0) - totalSpent,
          }
        : null,
    };
  }

  async findAll() {
    return this.membershipModel.find().exec();
  }

  async findOne(id: string) {
    const membership = await this.membershipModel.findById(id).exec();
    if (!membership) throw new NotFoundException('Membership not found');
    return membership;
  }

  async update(id: string, data: Partial<Membership>) {
    const membership = await this.membershipModel.findByIdAndUpdate(id, data, {
      new: true,
    });
    if (!membership) throw new NotFoundException('Membership not found');
    return membership;
  }

  async remove(id: string) {
    const res = await this.membershipModel.findByIdAndDelete(id);
    if (!res) throw new NotFoundException('Membership not found');
  }

  async previewTier(totalSpent: number) {
    const tiers = await this.membershipModel
      .find({})
      .sort({ minSpend: 1 })
      .lean();
    const matched =
      tiers.find(
        (t: any) =>
          totalSpent >= (t.minSpend ?? 0) &&
          (t.maxSpend == null || totalSpent <= t.maxSpend),
      ) || null;

    return { tier: matched?.name || null, matched };
  }
}
