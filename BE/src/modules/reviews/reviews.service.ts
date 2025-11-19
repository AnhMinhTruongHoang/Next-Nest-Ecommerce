import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, FilterQuery, Types } from 'mongoose';
import { Review, ReviewDocument } from './schema/review.schema';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { QueryReviewDto } from './dto/query-review.dto';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectModel(Review.name)
    private readonly reviewModel: SoftDeleteModel<ReviewDocument> &
      Model<ReviewDocument>,
  ) {}

  async create(
    userId: string,
    dto: CreateReviewDto,
    actor?: { _id: string; email: string },
  ) {
    try {
      const doc = await this.reviewModel.create({
        userId: new Types.ObjectId(userId),
        productId: new Types.ObjectId(dto.productId),
        rating: dto.rating,
        comment: dto.comment,
        createdBy: actor,
      });
      return doc;
    } catch (e: any) {
      if (e?.code === 11000) {
        throw new BadRequestException('Bạn đã đánh giá sản phẩm này.');
      }
      throw e;
    }
  }

  async findAll(q: QueryReviewDto) {
    const { productId, page = 1, limit = 10, sort = 'recent', star } = q;

    const filter: FilterQuery<ReviewDocument> = { isDeleted: false };
    if (productId) filter.productId = new Types.ObjectId(productId);
    if (star) filter.rating = star;

    const skip = (page - 1) * limit;

    const sortMap: Record<string, any> = {
      recent: { createdAt: -1 },
      high: { rating: -1, createdAt: -1 },
      low: { rating: 1, createdAt: -1 },
    };

    const [items, total] = await Promise.all([
      this.reviewModel
        .find(filter)
        .populate('userId', 'email avatar')
        .sort(sortMap[sort] || sortMap.recent)
        .skip(skip)
        .limit(limit)
        .lean()
        .exec(),
      this.reviewModel.countDocuments(filter),
    ]);

    return {
      items,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async summary(productId: string) {
    const pid = new Types.ObjectId(productId);
    const rows = await this.reviewModel.aggregate([
      { $match: { productId: pid, isDeleted: false } },
      {
        $group: {
          _id: '$rating',
          count: { $sum: 1 },
        },
      },
    ]);

    const counts: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    let total = 0;
    let sum = 0;
    for (const r of rows) {
      counts[r._id] = r.count;
      total += r.count;
      sum += r._id * r.count;
    }
    const average = total ? Number((sum / total).toFixed(2)) : 0;

    return { total, average, histogram: counts };
  }

  async findOne(id: string) {
    const doc = await this.reviewModel
      .findOne({ _id: id, isDeleted: false })
      .exec();
    if (!doc) throw new NotFoundException('Không tìm thấy review');
    return doc;
  }

  async update(
    id: string,
    dto: UpdateReviewDto,
    actor?: { _id: string; email: string },
  ) {
    const doc = await this.reviewModel
      .findOneAndUpdate(
        { _id: id, isDeleted: false },
        { ...dto, updatedBy: actor },
        { new: true },
      )
      .exec();
    if (!doc) throw new NotFoundException('Không tìm thấy review');
    return doc;
  }

  async remove(id: string, actor?: { _id: string; email: string }) {
    const doc = await this.reviewModel.findById(id);
    if (!doc || doc.isDeleted)
      throw new NotFoundException('Không tìm thấy review');

    (doc as any).deletedBy = actor;
    (doc as any).deletedAt = new Date();
    (doc as any).isDeleted = true;
    await doc.save();

    return { ok: true };
  }
}
