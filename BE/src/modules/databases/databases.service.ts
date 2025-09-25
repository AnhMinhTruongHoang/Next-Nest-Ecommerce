import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
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

  async onModuleInit() {
    const isInit = this.configService.get<string>('SHOULD_INIT');
    if (!isInit || isInit === 'false') return;

    // Seed Users
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

    // Seed Memberships
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

    // Seed Products (idempotent cho từng category)
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
                description: 'Gaming mouse',
                price: 20,
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
                description: 'Ergonomic gaming mouse',
                price: 50,
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
                description: 'Budget-friendly mouse',
                price: 30,
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
            ];
            break;

          case 'Keyboard':
            productsToInsert = [
              {
                name: 'Razer BlackWidow',
                description: 'Mechanical keyboard',
                price: 120,
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
                description: 'Premium gaming keyboard',
                price: 180,
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
                description: 'RGB gaming keyboard',
                price: 70,
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
            ];
            break;

          case 'Monitor':
            productsToInsert = [
              {
                name: 'ASUS TUF 24"',
                description: '144Hz gaming monitor',
                price: 200,
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
                description: '2K 165Hz gaming monitor',
                price: 400,
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
                description: 'Curved 144Hz monitor',
                price: 350,
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
                name: 'DXRacer Formula',
                description: 'Professional gaming chair',
                price: 250,
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
                description: 'Premium ergonomic chair',
                price: 450,
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
                description: 'Affordable gaming chair',
                price: 200,
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

    // Seed Orders + Payments
    const countOrders = await this.orderModel.countDocuments();
    if (countOrders === 0) {
      const users = await this.userModel.find({ role: 'USER' });
      const products = await this.productModel.find();

      if (users.length === 0 || products.length === 0) {
        this.logger.error(
          'Missing users or products, cannot seed orders/payments.',
        );
      } else {
        for (const user of users) {
          // random số đơn hàng (3-5)
          const orderCount = Math.floor(Math.random() * 3) + 3;

          for (let i = 0; i < orderCount; i++) {
            // random 1–3 sản phẩm mỗi order
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
