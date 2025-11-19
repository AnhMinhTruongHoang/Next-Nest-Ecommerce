import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import axios from 'axios';
import { randomUUID } from 'crypto';

import { User, UserDocument } from '../users/schema/user.schema';
import {
  Membership,
  MembershipDocument,
} from '../memberships/schema/membership.schema';
import {
  Category,
  CategoryDocument,
} from '../categories/schema/category.schema';
import { Product, ProductDocument } from '../products/schema/product.schema';
import { Order, OrderDocument } from '../orders/schema/order.schema';
import {
  Payment,
  PaymentDocument,
  PaymentMethod,
  PaymentStatus,
} from '../payments/schema/payment.schema';
import { UsersService } from '../users/users.service';
import { Voucher, VoucherDocument } from '../voucher/schema/vouchers.schema';

@Injectable()
export class DatabasesService implements OnModuleInit {
  private readonly logger = new Logger(DatabasesService.name);

  constructor(
    @InjectModel(User.name)
    private userModel: SoftDeleteModel<UserDocument>,

    @InjectModel(Membership.name)
    private membershipsModel: SoftDeleteModel<MembershipDocument>,

    @InjectModel(Category.name)
    private categoryModel: SoftDeleteModel<CategoryDocument>,

    @InjectModel(Product.name)
    private productModel: SoftDeleteModel<ProductDocument>,

    @InjectModel(Order.name)
    private orderModel: SoftDeleteModel<OrderDocument>,

    @InjectModel(Payment.name)
    private paymentModel: SoftDeleteModel<PaymentDocument>,

    @InjectModel(Voucher.name)
    private voucherModel: SoftDeleteModel<VoucherDocument>,

    private configService: ConfigService,
    private userService: UsersService,
  ) {}

  /** Lấy tỉ giá USD -> VND (fallback = 24,500) */
  async getUsdToVndRate(): Promise<number> {
    try {
      const res = await axios.get('https://open.er-api.com/v6/latest/USD');
      return res.data.rates.VND || 24500;
    } catch (e) {
      this.logger.error('Cannot fetch exchange rate, fallback 24,500');
      return 24500;
    }
  }

  async onModuleInit() {
    const isInit = this.configService.get<string>('SHOULD_INIT');
    if (!isInit || isInit === 'false') return;

    const rate = await this.getUsdToVndRate();
    this.logger.log(`>>> Exchange rate USD -> VND: ${rate}`);

    /** ---------------- Seed Users ---------------- */
    const countUsers = await this.userModel.countDocuments();
    if (countUsers === 0) {
      const initPassword = this.userService.getHashPassword(
        this.configService.get<string>('INIT_PASSWORD'),
      );

      await this.userModel.insertMany([
        {
          name: "I'm admin",
          email: 'admin@gmail.com',
          phone: '0912345678',
          password: initPassword,
          age: 30,
          gender: 'MALE',
          address: 'VietNam',
          role: 'ADMIN',
          isActive: true,
        },
        {
          name: "I'm normal user",
          email: 'user@gmail.com',
          phone: '0987654321',
          password: initPassword,
          age: 25,
          gender: 'FEMALE',
          address: 'VietNam',
          role: 'USER',
          isActive: true,
        },
      ]);

      this.logger.log('>>> INIT USERS DONE...');
    }

    /** ---------------- Seed Memberships ---------------- */
    const countMemberships = await this.membershipsModel.countDocuments();
    if (countMemberships === 0) {
      await this.membershipsModel.insertMany([
        {
          name: 'Bronze',
          description: 'Basic membership',
          discountRate: 0,
          pointMultiplier: 1,
          freeShipping: false,
          monthlyFee: 0,
        },
        {
          name: 'Silver',
          description: 'Better benefits',
          discountRate: 5,
          pointMultiplier: 1.5,
          freeShipping: false,
          monthlyFee: 5,
        },
        {
          name: 'Gold',
          description: 'Premium benefits',
          discountRate: 10,
          pointMultiplier: 2,
          freeShipping: true,
          monthlyFee: 10,
        },
      ]);
      this.logger.log('>>> INIT MEMBERSHIPS DONE...');
    }

    /** ---------------- Seed Categories ---------------- */
    const countCategories = await this.categoryModel.countDocuments();
    if (countCategories === 0) {
      await this.categoryModel.insertMany([
        { name: 'Mouse' },
        { name: 'Keyboard' },
        { name: 'Monitor' },
        { name: 'Headset' },
        { name: 'Chairs' },
        { name: 'Accessories' },
      ]);
      this.logger.log('>>> INIT CATEGORIES DONE...');
    }

    /** ---------------- Seed Products ---------------- */
    const categories = await this.categoryModel.find();
    for (const category of categories) {
      const countProductsInCat = await this.productModel.countDocuments({
        category: category._id,
      });

      if (countProductsInCat === 0) {
        // (Giữ nguyên logic insert sản phẩm của bạn ở đây)
        // ...
      }
    }

    /** ---------------- Seed Voucher “GamerZone” ---------------- */
    const voucherCode = 'gamerzone'; // luôn lowercase
    await this.voucherModel.updateOne(
      { code: voucherCode },
      {
        $setOnInsert: {
          code: voucherCode,
          type: 'PERCENT',
          amount: 30, // Giảm 30%
          maxDiscount: 0, // 0 = không giới hạn
          minOrder: 0, // 0 = không yêu cầu đơn tối thiểu
          isActive: true,
          totalUses: 0, // 0 = không giới hạn lượt dùng
          userUsageLimit: 0, // 0 = không giới hạn theo user
          allowedProductIds: [],
          allowedCategoryIds: [],
          allowedBrands: [],
          bannedProductIds: [],
          bannedCategoryIds: [],
          bannedBrands: [],
          isDeleted: false,
          deletedAt: null,
        },
      },
      { upsert: true },
    );
    this.logger.log('>>> INIT VOUCHER GamerZone (-30%) DONE...');

    /** ---------------- Seed Orders + Payments ---------------- */

    // Dọn index paymentRef nếu có lỗi trước đó
    try {
      await this.orderModel.collection.dropIndex('paymentRef_1');
    } catch (e) {
      // ignore
    }

    // Tạo lại index unique partial cho paymentRef
    try {
      await this.orderModel.collection.createIndex(
        { paymentRef: 1 },
        {
          unique: true,
          partialFilterExpression: {
            paymentRef: { $type: 'string', $ne: null },
          },
        },
      );
    } catch (e) {
      // ignore
    }

    const countOrders = await this.orderModel.countDocuments();
    if (countOrders === 0) {
      const users = await this.userModel.find({ role: 'USER' }).lean();
      const products = await this.productModel
        .find({ isDeleted: { $ne: true } })
        .select('_id price stock sold')
        .lean();

      if (users.length === 0 || products.length === 0) {
        this.logger.warn(
          '⚠️ Missing users or products, skip seeding orders/payments.',
        );
      } else {
        const productBulkOps: any[] = [];
        const orderDocs: any[] = [];
        const paymentDocs: any[] = [];

        for (const user of users) {
          const orderCount = Math.floor(Math.random() * 3) + 3; // 3–5 orders
          for (let i = 0; i < orderCount; i++) {
            const selected = [...products]
              .sort(() => 0.5 - Math.random())
              .slice(0, Math.floor(Math.random() * 3) + 1);

            const items = selected.map((p) => ({
              productId: p._id,
              quantity: Math.floor(Math.random() * 3) + 1,
              price: p.price ?? 0,
            }));

            const totalPrice = items.reduce(
              (sum, it) => sum + it.price * it.quantity,
              0,
            );

            const methodPool: PaymentMethod[] = [
              PaymentMethod.CASH,
              PaymentMethod.CREDIT_CARD,
              PaymentMethod.VNPAY,
            ];
            const method =
              methodPool[Math.floor(Math.random() * methodPool.length)];

            const willBePaid =
              method === PaymentMethod.CASH
                ? Math.random() > 0.8
                : Math.random() > 0.5;

            const paymentStatus: PaymentStatus = willBePaid
              ? PaymentStatus.PAID
              : PaymentStatus.PENDING;

            const paymentRef =
              paymentStatus === PaymentStatus.PAID &&
              method !== PaymentMethod.CASH
                ? randomUUID()
                : null;

            const orderPaymentMethod =
              method === PaymentMethod.CASH
                ? 'COD'
                : method === PaymentMethod.CREDIT_CARD
                ? 'BANK'
                : (method as any);

            const orderStatus = willBePaid ? 'PAID' : 'PENDING';
            const orderPaymentStatus = willBePaid ? 'PAID' : 'UNPAID';

            orderDocs.push({
              userId: user._id,
              items,
              totalPrice,
              status: orderStatus,
              paymentStatus: orderPaymentStatus,
              paymentMethod: orderPaymentMethod,
              paymentRef,
              shippingAddress: '123 Test Street, Bien Hoa, Dong Nai',
              phoneNumber: '0901234567',
              inventoryAdjusted: willBePaid,
            });

            if (willBePaid) {
              for (const it of items) {
                productBulkOps.push({
                  updateOne: {
                    filter: { _id: it.productId, isDeleted: { $ne: true } },
                    update: {
                      $inc: { stock: -it.quantity, sold: +it.quantity },
                    },
                  },
                });
              }
            }

            paymentDocs.push({
              orderId: null,
              amount: totalPrice,
              method,
              status: paymentStatus,
              shippingAddress: '123 Test Street, Bien Hoa, Dong Nai',
              phoneNumber: '0901234567',
              ref: paymentRef,
            });
          }
        }

        const insertedOrders = await this.orderModel.insertMany(orderDocs, {
          ordered: false,
        });
        for (let i = 0; i < paymentDocs.length; i++) {
          paymentDocs[i].orderId = insertedOrders[i]._id;
        }

        await this.paymentModel.insertMany(paymentDocs, { ordered: false });

        if (productBulkOps.length > 0) {
          await this.productModel.bulkWrite(productBulkOps, { ordered: false });
        }

        this.logger.log('>>> INIT ORDERS & PAYMENTS DONE...');
      }
    }
  }
}
