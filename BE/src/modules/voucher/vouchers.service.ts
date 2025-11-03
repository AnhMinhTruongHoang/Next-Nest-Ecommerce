import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  PreviewVoucherDto,
  PreviewVoucherResult,
} from './dto/preview-voucher.dto';
import aqp from 'api-query-params';
import { Voucher, VoucherDocument } from './schema/vouchers.schema';
import { CreateVoucherDto } from './dto/create-vouchers.dto';
import { UpdateVoucherDto } from './dto/update-vouchers.dto';

@Injectable()
export class VouchersService {
  constructor(
    @InjectModel(Voucher.name) private voucherModel: Model<VoucherDocument>,
  ) {}

  private computeDiscount(opts: {
    subtotal: number;
    type: 'PERCENT' | 'AMOUNT';
    amount: number;
    maxDiscount?: number;
  }) {
    const { subtotal, type, amount, maxDiscount } = opts;
    const base = Math.max(0, Number(subtotal) || 0);
    let discount = 0;

    if (type === 'PERCENT') {
      const percent = Math.max(0, Math.min(100, Number(amount) || 0));
      discount = Math.floor((base * percent) / 100);
      if (maxDiscount && maxDiscount > 0) {
        discount = Math.min(discount, maxDiscount);
      }
    } else {
      discount = Math.floor(Math.max(0, Number(amount) || 0));
    }

    // Không để vượt quá subtotal
    return Math.min(discount, base);
  }

  // ---------- CRUD ----------
  async create(dto: CreateVoucherDto) {
    // ép code về lowercase đã làm ở DTO transform
    const created = new this.voucherModel({
      ...dto,
      code: String(dto.code).toLowerCase().trim(),
    });
    return created.save();
  }

  async findAll(current = 1, pageSize = 10, qs?: any) {
    const { filter, sort, population } = aqp(qs);
    delete (filter as any).current;
    delete (filter as any).pageSize;

    const page = Math.max(1, Number(current) || 1);
    const limit = Math.max(1, Number(pageSize) || 10);
    const skip = (page - 1) * limit;

    const total = await this.voucherModel.countDocuments(filter);
    const pages = Math.ceil(total / limit);

    const result = await this.voucherModel
      .find(filter)
      .skip(skip)
      .limit(limit)
      .sort((sort as any) || { createdAt: -1 })
      .populate(population)
      .lean();

    return {
      meta: { current: page, pageSize: limit, pages, total },
      result,
    };
  }

  async findByCode(code: string) {
    const voucher = await this.voucherModel
      .findOne({ code: String(code).trim().toLowerCase() })
      .lean();
    if (!voucher) throw new NotFoundException('Voucher not found');
    return voucher;
  }

  async findOne(id: string) {
    const voucher = await this.voucherModel.findById(id).lean();
    if (!voucher) throw new NotFoundException('Voucher not found');
    return voucher;
  }

  async update(id: string, dto: UpdateVoucherDto) {
    if ((dto as any).code) {
      (dto as any).code = String((dto as any).code)
        .trim()
        .toLowerCase();
    }
    const updated = await this.voucherModel
      .findByIdAndUpdate(id, dto, { new: true })
      .lean();
    if (!updated) throw new NotFoundException('Voucher not found');
    return updated;
  }

  async remove(id: string) {
    const removed = await this.voucherModel
      .findByIdAndUpdate(
        id,
        { isDeleted: true, deletedAt: new Date() },
        { new: true },
      )
      .lean();
    if (!removed) throw new NotFoundException('Voucher not found');
    return removed;
  }

  // ---------- PREVIEW ----------
  async preview(dto: PreviewVoucherDto): Promise<PreviewVoucherResult> {
    const code = String(dto.code || '')
      .trim()
      .toLowerCase();
    if (!code) {
      return { valid: false, reason: 'Mã voucher trống', discount: 0 };
    }

    const voucher = await this.voucherModel
      .findOne({ code, isDeleted: false })
      .lean();
    if (!voucher) {
      return { valid: false, reason: 'Voucher không tồn tại', discount: 0 };
    }

    if (!voucher.isActive) {
      return { valid: false, reason: 'Voucher đã bị vô hiệu hóa', discount: 0 };
    }

    const now = new Date();
    if (voucher.startAt && now < new Date(voucher.startAt)) {
      return { valid: false, reason: 'Voucher chưa bắt đầu', discount: 0 };
    }
    if (voucher.endAt && now > new Date(voucher.endAt)) {
      return { valid: false, reason: 'Voucher đã hết hạn', discount: 0 };
    }

    // totalUses: 0 = unlimited
    if (voucher.totalUses && voucher.totalUses > 0) {
      if (voucher.usedCount >= voucher.totalUses) {
        return {
          valid: false,
          reason: 'Voucher đã hết lượt sử dụng',
          discount: 0,
        };
      }
    }

    const orderSubtotal = Math.max(0, Number(dto.orderSubtotal) || 0);
    if (voucher.minOrder && orderSubtotal < voucher.minOrder) {
      return {
        valid: false,
        reason: 'Chưa đạt giá trị đơn tối thiểu',
        discount: 0,
      };
    }

    // ----- Kiểm tra scope dựa trên mảng ids/brands truyền từ OrdersService -----
    // Chuẩn hoá mảng
    const prodIds = Array.isArray(dto.productIds)
      ? dto.productIds.map(String)
      : [];
    const catIds = Array.isArray(dto.categoryIds)
      ? dto.categoryIds.map(String)
      : [];
    const brands = Array.isArray(dto.brands)
      ? dto.brands.map((b) => String(b).toLowerCase())
      : [];

    const allowedProd = new Set((voucher.allowedProductIds || []).map(String));
    const allowedCat = new Set((voucher.allowedCategoryIds || []).map(String));
    const allowedBrand = new Set(
      (voucher.allowedBrands || []).map((s) => String(s).toLowerCase()),
    );

    const bannedProd = new Set((voucher.bannedProductIds || []).map(String));
    const bannedCat = new Set((voucher.bannedCategoryIds || []).map(String));
    const bannedBrand = new Set(
      (voucher.bannedBrands || []).map((s) => String(s).toLowerCase()),
    );

    // Nếu giao với banned -> không áp dụng
    const hitBanned =
      prodIds.some((id) => bannedProd.has(id)) ||
      catIds.some((id) => bannedCat.has(id)) ||
      brands.some((b) => bannedBrand.has(b));
    if (hitBanned) {
      return {
        valid: false,
        reason: 'Không áp dụng cho sản phẩm/danh mục/thương hiệu bị hạn chế',
        discount: 0,
      };
    }

    // Nếu tồn tại allowed-scope, yêu cầu có giao nhau > 0
    const hasAllowedScope =
      allowedProd.size > 0 || allowedCat.size > 0 || allowedBrand.size > 0;

    if (hasAllowedScope) {
      const passAllowed =
        prodIds.some((id) => allowedProd.has(id)) ||
        catIds.some((id) => allowedCat.has(id)) ||
        brands.some((b) => allowedBrand.has(b));

      if (!passAllowed) {
        return {
          valid: false,
          reason: 'Không áp dụng cho phạm vi hiện tại',
          discount: 0,
        };
      }
    }

    // Tính giảm giá trên toàn bộ orderSubtotal (theo đúng dữ liệu hiện có)
    const discount = this.computeDiscount({
      subtotal: orderSubtotal,
      type: voucher.type,
      amount: voucher.amount,
      maxDiscount: voucher.maxDiscount,
    });

    if (discount <= 0) {
      return {
        valid: false,
        reason: 'Không đủ điều kiện để giảm giá',
        discount: 0,
      };
    }

    // Có thể chỉ trả về 1 số field public
    return {
      valid: true,
      discount,
      voucher: {
        _id: voucher._id,
        code: voucher.code,
        type: voucher.type,
        amount: voucher.amount,
        maxDiscount: voucher.maxDiscount ?? 0,
        minOrder: voucher.minOrder ?? 0,
        startAt: voucher.startAt ?? null,
        endAt: voucher.endAt ?? null,
      },
    };
  }
}
