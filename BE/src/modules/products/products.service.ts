import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { isValidObjectId } from 'mongoose';
import aqp from 'api-query-params';
import { Product, ProductDocument } from './schema/product.schema';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name)
    private readonly productModel: SoftDeleteModel<ProductDocument>,
  ) {}

  // -------- helpers --------
  private stripVN(input = '') {
    return input
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/Đ/g, 'D')
      .toLowerCase()
      .trim();
  }

  // -------- CRUD --------
  async create(dto: CreateProductDto) {
    const created = new this.productModel(dto);
    return created.save();
  }

  async findAll(currentPage: number, limit: number, qs: any) {
    const { filter, sort } = aqp(qs);

    // sạch các tham số phân trang do FE gửi
    delete filter.current;
    delete filter.pageSize;

    // luôn bỏ record đã xóa mềm
    (filter as any).isDeleted = false;

    // chuẩn hóa bộ lọc giá
    if (filter.price) {
      const f: any = filter.price;

      // trường hợp aqp parse thành object {$gte: { '': '100000' }}
      if (f.$gte && typeof f.$gte === 'object') {
        f.$gte = Number(Object.values(f.$gte)[0]);
      }
      if (f.$lte && typeof f.$lte === 'object') {
        f.$lte = Number(Object.values(f.$lte)[0]);
      }
      // hỗ trợ alias gte/lte
      if (f.gte) {
        f.$gte = Number(f.gte);
        delete f.gte;
      }
      if (f.lte) {
        f.$lte = Number(f.lte);
        delete f.lte;
      }
      filter.price = f;
    }

    const safePage = Math.max(
      1,
      Number.isFinite(+currentPage) ? +currentPage : 1,
    );
    const safeLimit = Math.max(1, Number.isFinite(+limit) ? +limit : 20);
    const skip = (safePage - 1) * safeLimit;

    const [totalItems, result] = await Promise.all([
      this.productModel.countDocuments(filter as any),
      this.productModel
        .find(filter as any)
        .sort(sort as any)
        .skip(skip)
        .limit(safeLimit)
        .populate('category', 'name')
        .lean()
        .exec(),
    ]);

    return {
      meta: {
        current: safePage,
        pageSize: safeLimit,
        pages: Math.ceil(totalItems / safeLimit),
        total: totalItems,
      },
      result,
    };
  }

  async findOne(id: string) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid product id');
    }
    const product = await this.productModel.findById(id).lean().exec();
    if (!product || (product as any).isDeleted) {
      throw new NotFoundException('Product not found');
    }
    return product;
  }

  async update(id: string, dto: UpdateProductDto) {
    const product = await this.productModel
      .findByIdAndUpdate(id, dto, { new: true })
      .lean()
      .exec();
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  async remove(id: string) {
    const updated = await this.productModel.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true },
    );
    if (!updated) throw new NotFoundException('Product not found');
    return { ok: true };
  }

  async suggest(keyword: string) {
    const q = this.stripVN(keyword);
    if (!q) return [];

    const docs = await this.productModel
      .find({ isDeleted: false })
      .select('_id name thumbnail price')
      .limit(50)
      .lean();

    return docs.filter((p) => this.stripVN(p.name).includes(q)).slice(0, 8);
  }
}
