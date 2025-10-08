import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import axios from 'axios';

import { User, UserDocument } from '../users/schemas/user.schema';
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
import { Payment, PaymentDocument } from '../payments/schema/payment.schema';
import { UsersService } from '../users/users.service';

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
        { name: 'Chairs' },
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
        let productsToInsert: any[] = [];

        switch (category.name) {
          case 'Mouse':
            productsToInsert = [
              {
                name: 'Logitech G102',
                description:
                  'Chuột gaming nhỏ gọn với cảm biến chính xác, thiết kế đơn giản nhưng bền bỉ. Phù hợp cho cả game thủ và dân văn phòng, hỗ trợ đèn LED RGB tùy chỉnh.',
                price: 20 * rate,
                stock: 100,
                sold: 0,
                brand: 'Logitech',
                category: category._id,
                thumbnail: '/images/thumbnails/LogitechG102t.jpg',
                images: [
                  '/images/slider/LogitechG102s1.jpg',
                  '/images/slider/LogitechG102s2.jpg',
                  '/images/slider/LogitechG102s3.jpg',
                ],
              },
              {
                name: 'Razer DeathAdder',
                description:
                  'Chuột gaming huyền thoại với thiết kế công thái học, ôm tay thoải mái. Trang bị cảm biến quang học cao cấp, tốc độ phản hồi nhanh, lý tưởng cho các tựa game FPS.',
                price: 50 * rate,
                stock: 80,
                sold: 0,
                brand: 'Razer',
                category: category._id,
                thumbnail: '/images/thumbnails/RazerDeathAdderT.jpg',
                images: [
                  '/images/slider/RazerDeathAdders1.jpg',
                  '/images/slider/RazerDeathAdders2.jpg',
                  '/images/slider/RazerDeathAdders3.jpg',
                ],
              },
              {
                name: 'SteelSeries Rival 3',
                description:
                  'Chuột gaming giá rẻ nhưng hiệu năng vượt trội. Độ bền cao, cảm biến chính xác, đèn RGB tinh tế – lựa chọn hoàn hảo cho game thủ mới bắt đầu.',
                price: 30 * rate,
                stock: 120,
                sold: 0,
                brand: 'SteelSeries',
                category: category._id,
                thumbnail: '/images/thumbnails/SteelSeriesRivalT.jpg',
                images: [
                  '/images/slider/SteelSeriesRivals1.jpg',
                  '/images/slider/SteelSeriesRivals2.jpg',
                  '/images/slider/SteelSeriesRivals3.jpg',
                ],
              },
              {
                name: 'Razer Cobra',
                description:
                  'Chuột gaming cao cấp với thiết kế hiện đại, cảm biến siêu nhạy và độ bền vượt trội. Mang lại trải nghiệm mượt mà cho cả game thủ chuyên nghiệp.',
                price: 450 * rate,
                stock: 10,
                sold: 0,
                brand: 'Razer/zzz',
                category: category._id,
                thumbnail: '/images/thumbnails/razer.zzz.mouse.jpg',
                images: [
                  '/images/slider/mouse.razer.zzz1.jpg',
                  '/images/slider/mouse.razer.zzz2.jpg',
                ],
              },
              {
                name: 'Razer Gigantus V2 Medium',
                description:
                  'Bàn di chuột gaming với bề mặt vải mịn, tối ưu cho cả tốc độ và độ chính xác. Đế cao su chống trượt, kích thước vừa phải cho mọi setup.',
                price: 450 * rate,
                stock: 10,
                sold: 0,
                brand: 'Razer/zzz',
                category: category._id,
                thumbnail: '/images/thumbnails/razer.zzz.pad.jpg',
                images: [
                  '/images/slider/mouse.razer.zzz2.jpg',
                  '/images/slider/razer.zzz.jpg',
                ],
              },
            ];
            break;

          case 'Keyboard':
            productsToInsert = [
              {
                name: 'Razer BlackWidow',
                description:
                  'Bàn phím cơ gaming nổi tiếng với switch Razer độc quyền, độ bền cao, phản hồi nhanh. Thiết kế mạnh mẽ, đèn RGB sống động.',
                price: 120 * rate,
                stock: 50,
                sold: 0,
                brand: 'Razer',
                category: category._id,
                thumbnail: '/images/thumbnails/RazerBlackWidowT.jpg',
                images: [
                  '/images/slider/RazerBlackWidows1.jpg',
                  '/images/slider/RazerBlackWidows2.jpg',
                  '/images/slider/RazerBlackWidows3.jpg',
                ],
              },
              {
                name: 'Corsair K95 RGB',
                description:
                  'Bàn phím cơ cao cấp với khung nhôm chắc chắn, switch Cherry MX, hệ thống đèn RGB đa dạng. Tích hợp phím macro chuyên dụng cho game thủ chuyên nghiệp.',
                price: 180 * rate,
                stock: 40,
                sold: 0,
                brand: 'Corsair',
                category: category._id,
                thumbnail: '/images/thumbnails/CorsairK95T.jpg',
                images: [
                  '/images/slider/CorsairK95s1.jpg',
                  '/images/slider/CorsairK95s2.jpg',
                  '/images/slider/CorsairK95s3.jpg',
                ],
              },
              {
                name: 'Logitech Aurora G715 RGB',
                description:
                  'Bàn phím cơ nhỏ gọn, phong cách trẻ trung với hệ thống đèn RGB rực rỡ. Switch cơ học mượt mà, phù hợp cho cả chơi game và gõ văn bản.',
                price: 70 * rate,
                stock: 60,
                sold: 0,
                brand: 'Logitech',
                category: category._id,
                thumbnail: '/images/thumbnails/LogitechAuroraT.jpg',
                images: [
                  '/images/slider/LogitechAuroras1.jpg',
                  '/images/slider/LogitechAuroras2.jpg',
                  '/images/slider/LogitechAuroras3.jpg',
                ],
              },
              {
                name: 'Razer BlackWidow V4 X',
                description:
                  'Phiên bản đặc biệt với thiết kế độc đáo, switch cơ học bền bỉ, đèn nền RGB tùy chỉnh. Mang lại trải nghiệm gõ phím êm ái và chính xác.',
                price: 70 * rate,
                stock: 60,
                sold: 0,
                brand: 'Razer/zzz',
                category: category._id,
                thumbnail: '/images/thumbnails/razer.zzz.keyboard.jpg',
                images: [
                  '/images/slider/keyoard.razer.zzz1.jpg',
                  '/images/slider/razer.zzz.jpg',
                ],
              },
            ];
            break;

          case 'Monitor':
            productsToInsert = [
              {
                name: 'ASUS TUF 24"',
                description:
                  'Màn hình gaming 24 inch, tần số quét 144Hz, thời gian phản hồi nhanh. Công nghệ Adaptive-Sync giúp hình ảnh mượt mà, không xé hình.',
                price: 200 * rate,
                stock: 30,
                sold: 0,
                brand: 'ASUS',
                category: category._id,
                thumbnail: '/images/thumbnails/ASUSTUF24T.jpg',
                images: [
                  '/images/slider/ASUSTUF24s1.jpg',
                  '/images/slider/ASUSTUF24s2.jpg',
                ],
              },
              {
                name: 'Acer Predator 27"',
                description:
                  'Màn hình gaming 27 inch độ phân giải 2K, tần số quét 165Hz. Thiết kế hầm hố, màu sắc sống động, tối ưu cho trải nghiệm chơi game cao cấp.',
                price: 400 * rate,
                stock: 20,
                sold: 0,
                brand: 'Acer',
                category: category._id,
                thumbnail: '/images/thumbnails/AcerPredator27T.jpg',
                images: [
                  '/images/slider/AcerPredator27s1.jpg',
                  '/images/slider/AcerPredator27s2.jpg',
                ],
              },
              {
                name: 'Samsung Odyssey G5',
                description:
                  'Màn hình cong 27 inch, tần số quét 144Hz, độ phân giải QHD. Mang lại trải nghiệm đắm chìm, hình ảnh sắc nét, phù hợp cho cả game và giải trí.',
                price: 350 * rate,
                stock: 25,
                sold: 0,
                brand: 'Samsung',
                category: category._id,
                thumbnail: '/images/thumbnails/SamsungOdysseyG5T.jpg',
                images: [
                  '/images/slider/SamsungOdysseyG5s1.jpg',
                  '/images/slider/SamsungOdysseyG5s2.jpg',
                ],
              },
            ];
            break;

          case 'Chairs':
            productsToInsert = [
              {
                name: 'Razer Iskur V2 X',
                description:
                  'Ghế gaming công thái học với thiết kế ôm lưng, hỗ trợ cột sống tối ưu. Chất liệu cao cấp, bền bỉ, mang lại sự thoải mái khi chơi game lâu dài.',
                price: 450 * rate,
                stock: 10,
                sold: 0,
                brand: 'Razer/zzz',
                category: category._id,
                thumbnail: '/images/thumbnails/razer.zzz.chair.jpg',
                images: [
                  '/images/slider/chair.razer.zzz1.jpg',
                  '/images/slider/razer.zzz.jpg',
                ],
              },
              {
                name: 'DXRacer Formula',
                description:
                  'Ghế gaming chuyên nghiệp với thiết kế thể thao, khung thép chắc chắn. Đệm mút dày, điều chỉnh linh hoạt, phù hợp cho cả game thủ và streamer.',
                price: 250 * rate,
                stock: 15,
                sold: 0,
                brand: 'DXRacer',
                category: category._id,
                thumbnail: '/images/thumbnails/DXRacerFormulaT.jpg',
                images: [
                  '/images/slider/DXRacerFormulas1.png',
                  '/images/slider/DXRacerFormulas2.jpg',
                ],
              },
              {
                name: 'Secretlab Titan Evo',
                description:
                  'Ghế gaming cao cấp với chất liệu da PU bền bỉ, thiết kế sang trọng. Tích hợp nhiều tính năng điều chỉnh, mang lại sự thoải mái tối đa cho game thủ hardcore.',
                price: 450 * rate,
                stock: 10,
                sold: 0,
                brand: 'Secretlab',
                category: category._id,
                thumbnail: '/images/thumbnails/SecretlabTitanEvoT.jpg',
                images: [
                  '/images/slider/SecretlabTitanEvos1.jpg',
                  '/images/slider/SteelSeriesRivals2.jpg',
                ],
              },
              {
                name: 'AKRacing Core EX',
                description:
                  'Ghế gaming giá phải chăng nhưng chất lượng vượt trội. Thiết kế trẻ trung, khung thép bền, đệm ngồi thoải mái cho nhiều giờ sử dụng.',
                price: 200 * rate,
                stock: 20,
                sold: 0,
                brand: 'AKRacing',
                category: category._id,
                thumbnail: '/images/thumbnails/AKRacingCoreExT.jpg',
                images: [
                  '/images/slider/AKRacingCoreExs1.jpg',
                  '/images/slider/AKRacingCoreEXs2.jpg',
                ],
              },
            ];
            break;
        }

        if (productsToInsert.length > 0) {
          await this.productModel.insertMany(productsToInsert);
          this.logger.log(`>>> INIT PRODUCTS for ${category.name} DONE...`);
        }
      }
    }

    /** ---------------- Seed Orders + Payments ---------------- */
    const countOrders = await this.orderModel.countDocuments();
    if (countOrders === 0) {
      const users = await this.userModel.find({ role: 'USER' });
      const products = await this.productModel.find();

      if (users.length === 0 || products.length === 0) {
        this.logger.warn(
          '⚠️ Missing users or products, skip seeding orders/payments.',
        );
      } else {
        for (const user of users) {
          const orderCount = Math.floor(Math.random() * 3) + 3; // 3–5 orders

          for (let i = 0; i < orderCount; i++) {
            const selectedProducts = products
              .sort(() => 0.5 - Math.random())
              .slice(0, Math.floor(Math.random() * 3) + 1);

            const items = selectedProducts.map((p) => ({
              productId: p._id,
              quantity: Math.floor(Math.random() * 3) + 1,
              price: p.price,
            }));

            const totalPrice = items.reduce(
              (sum, item) => sum + item.price * item.quantity,
              0,
            );

            const order = await this.orderModel.create({
              userId: user._id,
              items,
              totalPrice,
              status: 'pending',
            });

            await this.paymentModel.create({
              orderId: order._id,
              amount: order.totalPrice,
              method: Math.random() > 0.5 ? 'cash' : 'credit_card',
              status: Math.random() > 0.3 ? 'paid' : 'pending',
            });
          }
        }

        this.logger.log('>>> INIT ORDERS & PAYMENTS DONE...');
      }
    }
  }
}
