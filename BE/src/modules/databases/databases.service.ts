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

    // Seed Categories
    const countCategories = await this.categoryModel.countDocuments();
    if (countCategories === 0) {
      await this.categoryModel.insertMany([
        { name: 'Mouse', description: 'gaming gear' },
        { name: 'Keyboard', description: 'gaming gear' },
        { name: 'Monitor', description: 'gaming gear' },
        { name: 'Chairs', description: 'gaming gear' },
      ]);
      this.logger.log('>>> INIT CATEGORIES DONE...');
    }

    // Seed Products
    const countProducts = await this.productModel.countDocuments();
    if (countProducts === 0) {
      const categories = await this.categoryModel.find();

      const mouse = categories.find((c) => c.name === 'Mouse');
      const keyboard = categories.find((c) => c.name === 'Keyboard');
      const monitor = categories.find((c) => c.name === 'Monitor');
      const chairs = categories.find((c) => c.name === 'Chairs');

      // Product sample
      const products = [
        // Mouse
        {
          name: 'Logitech G102',
          description: 'Gaming mouse',
          price: 20,
          stock: 100,
          category: mouse?._id,
          brand: 'Logitech',
        },
        {
          name: 'Razer DeathAdder',
          description: 'Ergonomic gaming mouse',
          price: 50,
          stock: 80,
          category: mouse?._id,
          brand: 'Razer',
        },
        {
          name: 'SteelSeries Rival 3',
          description: 'Budget-friendly gaming mouse',
          price: 30,
          stock: 120,
          category: mouse?._id,
          brand: 'SteelSeries',
        },

        // Keyboard
        {
          name: 'Razer BlackWidow',
          description: 'Mechanical keyboard',
          price: 120,
          stock: 50,
          category: keyboard?._id,
          brand: 'Razer',
        },
        {
          name: 'Corsair K95 RGB',
          description: 'Premium gaming keyboard',
          price: 180,
          stock: 40,
          category: keyboard?._id,
          brand: 'Corsair',
        },
        {
          name: 'Logitech G213',
          description: 'Membrane gaming keyboard',
          price: 70,
          stock: 60,
          category: keyboard?._id,
          brand: 'Logitech',
        },

        // Monitor
        {
          name: 'ASUS TUF 24"',
          description: '144Hz gaming monitor',
          price: 200,
          stock: 30,
          category: monitor?._id,
          brand: 'ASUS',
        },
        {
          name: 'Acer Predator 27"',
          description: '2K 165Hz gaming monitor',
          price: 400,
          stock: 20,
          category: monitor?._id,
          brand: 'Acer',
        },
        {
          name: 'Samsung Odyssey G5',
          description: 'Curved 144Hz monitor',
          price: 350,
          stock: 25,
          category: monitor?._id,
          brand: 'Samsung',
        },

        // Chairs
        {
          name: 'DXRacer Formula',
          description: 'Professional gaming chair',
          price: 250,
          stock: 15,
          category: chairs?._id,
          brand: 'DXRacer',
        },
        {
          name: 'Secretlab Titan Evo',
          description: 'Premium ergonomic chair',
          price: 450,
          stock: 10,
          category: chairs?._id,
          brand: 'Secretlab',
        },
        {
          name: 'AKRacing Core EX',
          description: 'Affordable gaming chair',
          price: 200,
          stock: 20,
          category: chairs?._id,
          brand: 'AKRacing',
        },
      ];

      await this.productModel.insertMany(products);
      this.logger.log('>>> INIT PRODUCTS DONE...');
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
