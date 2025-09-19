import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Cart, CartDocument } from './Schema/cart.schema';
import { ICart } from 'src/types/carts.interface';

@Injectable()
export class CartsService {
  constructor(@InjectModel(Cart.name) private cartModel: Model<CartDocument>) {}

  create(data: ICart) {
    const created = new this.cartModel(data);
    return created.save();
  }

  findAll() {
    return this.cartModel.find().exec();
  }

  findOne(id: string) {
    return this.cartModel.findById(id).exec();
  }

  update(id: string, data: Partial<ICart>) {
    return this.cartModel.findByIdAndUpdate(id, data, { new: true }).exec();
  }

  remove(id: string) {
    return this.cartModel
      .findByIdAndUpdate(
        id,
        { isDeleted: true, deletedAt: new Date() },
        { new: true },
      )
      .exec();
  }
}
