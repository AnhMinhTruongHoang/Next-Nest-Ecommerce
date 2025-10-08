import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ProductDocument, Product } from './schema/product.schema';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import aqp from 'api-query-params';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name)
    private productModel: SoftDeleteModel<ProductDocument>,
  ) {}

  async create(dto: CreateProductDto) {
    const created = new this.productModel(dto);
    return created.save();
  }
  /// find all

  async findAll(currentPage: number, limit: number, qs: any) {
    const { filter, sort } = aqp(qs);
    delete filter.current;
    delete filter.pageSize;

    if (filter.price) {
      if (filter.price.$gte && typeof filter.price.$gte === 'object') {
        filter.price.$gte = Number(Object.values(filter.price.$gte)[0]);
      }
      if (filter.price.$lte && typeof filter.price.$lte === 'object') {
        filter.price.$lte = Number(Object.values(filter.price.$lte)[0]);
      }

      if (filter.price.gte) {
        filter.price.$gte = Number(filter.price.gte);
        delete filter.price.gte;
      }
      if (filter.price.lte) {
        filter.price.$lte = Number(filter.price.lte);
        delete filter.price.lte;
      }
    }

    console.log('Final filter:', filter);

    const safePage = Math.max(1, Number(currentPage) || 1);
    const safeLimit = Math.max(1, Number(limit) || 20);
    const offset = (safePage - 1) * safeLimit;

    const totalItems = await this.productModel.countDocuments(filter);
    const totalPages = Math.ceil(totalItems / safeLimit);

    const result = await this.productModel
      .find(filter)
      .skip(offset)
      .limit(safeLimit)
      .sort(sort as any)
      .populate('category', 'name')
      .exec();

    return {
      meta: {
        current: safePage,
        pageSize: safeLimit,
        pages: totalPages,
        total: totalItems,
      },
      result,
    };
  }

  ///

  async findOne(id: string) {
    const product = await this.productModel.findById(id).exec();
    if (!product || product.isDeleted)
      throw new NotFoundException('Product not found');
    return product;
  }

  async update(id: string, dto: UpdateProductDto) {
    const product = await this.productModel
      .findByIdAndUpdate(id, dto, { new: true })
      .exec();
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  async remove(id: string) {
    const result = await this.productModel.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true },
    );
    if (!result) throw new NotFoundException('Product not found');
    return result;
  }
}
