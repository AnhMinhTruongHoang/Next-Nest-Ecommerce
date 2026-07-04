import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { isValidObjectId, Types } from 'mongoose';
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

  //// find + fillter

  async findAll(currentPage: number, limit: number, qs: any) {
    const { filter, sort } = aqp(qs);
    // dọn các param phân trang FE gửi
    delete (filter as any).current;
    delete (filter as any).pageSize;

    // luôn chỉ lấy record chưa xoá mềm
    (filter as any).isDeleted = false;

    // ----- KEYWORD: q -> tìm theo tên
    if (qs?.q && String(qs.q).trim()) {
      const kw = String(qs.q).trim();
      // chứa từ khóa, không phân biệt hoa thường
      (filter as any).name = {
        $regex: new RegExp(kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'),
      };
    }

    // ----- CATEGORY: category=<id1,id2,...>
    if (qs?.category) {
      const catIds = String(qs.category)
        .split(',')
        .map((s) => s.trim())
        .filter((s) => isValidObjectId(s))
        .map((s) => new Types.ObjectId(s));
      if (catIds.length > 0) {
        // nếu schema là 1 ObjectId: dùng $in; nếu là mảng ObjectId cũng OK
        (filter as any).category = { $in: catIds };
      } else {
        delete (filter as any).category;
      }
    }

    // ----- BRAND theo tên (string): brand=Razer,Logitech
    if (qs?.brand) {
      const names = String(qs.brand)
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean)
        .map(
          (n) =>
            new RegExp(`^${n.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i'),
        );
      if (names.length > 0) {
        (filter as any).brand = { $in: names };
      } else {
        delete (filter as any).brand;
      }
    }

    /// brand
    if (qs?.brandId) {
      const brandIds = String(qs.brandId)
        .split(',')
        .map((s) => s.trim())
        .filter(isValidObjectId)
        .map((id) => new Types.ObjectId(id));
      if (brandIds.length > 0) {
        (filter as any).brandId = { $in: brandIds };
      } else {
        delete (filter as any).brandId;
      }
    }

    // ----- PRICE: chuẩn hoá gte/lte
    if ((filter as any).price) {
      const f: any = (filter as any).price;
      if (f.$gte && typeof f.$gte === 'object')
        f.$gte = Number(Object.values(f.$gte)[0]);
      if (f.$lte && typeof f.$lte === 'object')
        f.$lte = Number(Object.values(f.$lte)[0]);
      if (f.gte != null) {
        f.$gte = Number(f.gte);
        delete f.gte;
      }
      if (f.lte != null) {
        f.$lte = Number(f.lte);
        delete f.lte;
      }
      (filter as any).price = f;
    }

    // ----- phân trang & sort an toàn
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
        .sort((sort as any) || { sold: -1, createdAt: -1 }) // default sort
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

  /////
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

  private removeVietnameseAccent(text: string) {
    return String(text || '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/Đ/g, 'D')
      .toLowerCase()
      .trim();
  }

  private escapeRegex(text: string) {
    return String(text || '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  async suggest(keyword: string) {
    const rawKeyword = String(keyword || '').trim();

    if (!rawKeyword) return [];

    const normalizedKeyword = this.removeVietnameseAccent(rawKeyword);

    const aliasMap: Record<string, string[]> = {
      chuot: ['chuột', 'chuot', 'mouse'],
      mouse: ['chuột', 'chuot', 'mouse'],

      'ban phim': ['bàn phím', 'ban phim', 'keyboard'],
      banphim: ['bàn phím', 'ban phim', 'keyboard'],
      keyboard: ['bàn phím', 'ban phim', 'keyboard'],

      'tai nghe': ['tai nghe', 'headset', 'headphones'],
      tainghe: ['tai nghe', 'headset', 'headphones'],
      headset: ['tai nghe', 'headset', 'headphones'],

      'man hinh': ['màn hình', 'man hinh', 'monitor'],
      manhinh: ['màn hình', 'man hinh', 'monitor'],
      monitor: ['màn hình', 'man hinh', 'monitor'],

      ghe: ['ghế', 'ghe', 'chairs', 'chair'],
      chair: ['ghế', 'ghe', 'chairs', 'chair'],
      chairs: ['ghế', 'ghe', 'chairs', 'chair'],

      'phu kien': ['phụ kiện', 'phu kien', 'accessories', 'accessory'],
      phukien: ['phụ kiện', 'phu kien', 'accessories', 'accessory'],
      accessories: ['phụ kiện', 'phu kien', 'accessories', 'accessory'],
    };

    const keywordParts = normalizedKeyword.split(/\s+/).filter(Boolean);

    const searchTerms = new Set<string>([
      rawKeyword,
      normalizedKeyword,
      ...keywordParts,
    ]);

    for (const [key, values] of Object.entries(aliasMap)) {
      const normalizedKey = this.removeVietnameseAccent(key);

      if (
        normalizedKeyword === normalizedKey ||
        normalizedKeyword.includes(normalizedKey) ||
        keywordParts.includes(normalizedKey)
      ) {
        values.forEach((value) => searchTerms.add(value));
      }
    }

    const regexList = Array.from(searchTerms)
      .filter(Boolean)
      .map((term) => new RegExp(this.escapeRegex(term), 'i'));

    return this.productModel
      .aggregate([
        {
          $match: {
            isDeleted: { $ne: true },
          },
        },
        {
          $lookup: {
            from: 'categories',
            localField: 'category',
            foreignField: '_id',
            as: 'categoryData',
          },
        },
        {
          $unwind: {
            path: '$categoryData',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $match: {
            $or: regexList.flatMap((regex) => [
              { name: regex },
              { brand: regex },
              { description: regex },
              { 'categoryData.name': regex },
            ]),
          },
        },
        {
          $addFields: {
            searchScore: {
              $switch: {
                branches: [
                  {
                    case: {
                      $regexMatch: {
                        input: '$name',
                        regex: new RegExp(
                          `^${this.escapeRegex(rawKeyword)}`,
                          'i',
                        ),
                      },
                    },
                    then: 100,
                  },
                  {
                    case: {
                      $regexMatch: {
                        input: '$name',
                        regex: new RegExp(this.escapeRegex(rawKeyword), 'i'),
                      },
                    },
                    then: 80,
                  },
                  {
                    case: {
                      $regexMatch: {
                        input: '$brand',
                        regex: new RegExp(this.escapeRegex(rawKeyword), 'i'),
                      },
                    },
                    then: 60,
                  },
                  {
                    case: {
                      $regexMatch: {
                        input: '$categoryData.name',
                        regex: new RegExp(this.escapeRegex(rawKeyword), 'i'),
                      },
                    },
                    then: 50,
                  },
                ],
                default: 10,
              },
            },
          },
        },
        {
          $sort: {
            searchScore: -1,
            sold: -1,
            createdAt: -1,
          },
        },
        {
          $limit: 8,
        },
        {
          $project: {
            _id: 1,
            name: 1,
            brand: 1,
            price: 1,
            thumbnail: 1,
            sold: 1,
            category: '$categoryData.name',
          },
        },
      ])
      .exec();
  }
}
