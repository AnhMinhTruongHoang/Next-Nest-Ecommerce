import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Payment, PaymentDocument } from './Schema/payment.schema';
import { IPayment } from 'src/types/payments.interface';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectModel(Payment.name)
    private paymentModel: SoftDeleteModel<PaymentDocument>,
  ) {}

  create(data: IPayment) {
    const created = new this.paymentModel(data);
    return created.save();
  }

  findAll() {
    return this.paymentModel.find().exec();
  }

  findOne(id: string) {
    return this.paymentModel.findById(id).exec();
  }

  update(id: string, data: Partial<IPayment>) {
    return this.paymentModel.findByIdAndUpdate(id, data, { new: true }).exec();
  }

  remove(id: string) {
    return this.paymentModel
      .findByIdAndUpdate(
        id,
        { isDeleted: true, deletedAt: new Date() },
        { new: true },
      )
      .exec();
  }
}
