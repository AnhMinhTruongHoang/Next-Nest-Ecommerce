import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { Review, ReviewDocument } from './Schema/review.schema';
import { IReview } from 'src/types/reviews.interface';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectModel(Review.name)
    private reviewModel: SoftDeleteModel<ReviewDocument>,
  ) {}

  create(data: IReview) {
    const created = new this.reviewModel(data);
    return created.save();
  }

  findAll() {
    return this.reviewModel.find().exec();
  }

  findOne(id: string) {
    return this.reviewModel.findById(id).exec();
  }

  update(id: string, data: Partial<IReview>) {
    return this.reviewModel.findByIdAndUpdate(id, data, { new: true }).exec();
  }

  remove(id: string) {
    return this.reviewModel
      .findByIdAndUpdate(
        id,
        { isDeleted: true, deletedAt: new Date() },
        { new: true },
      )
      .exec();
  }
}
