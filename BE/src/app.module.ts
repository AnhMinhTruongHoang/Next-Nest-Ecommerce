import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { softDeletePlugin } from 'soft-delete-plugin-mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { ThrottlerModule } from '@nestjs/throttler';
import { HealthModule } from './health/health.module';
import google_oauth_config from './config/google_oauth_config';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { UsersModule } from './modules/users/users.module';
import { FilesModule } from './modules/files/files.module';
import { DatabasesModule } from './modules/databases/databases.module';
import { ProductsModule } from './modules/products/products.module';
import { MembershipsModule } from './modules/memberships/memberships.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { OrdersModule } from './modules/orders/orders.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { CartsModule } from './modules/carts/carts.module';
import { ReviewsModule } from './modules/reviews/reviews.module';
import { MulterModule } from '@nestjs/platform-express';
import { multerConfig } from './modules/files/multer.config';
import { VnpayModule } from './modules/vnpay/vnpay.module';
import { VouchersModule } from './modules/voucher/vouchers.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),

    MulterModule.register(multerConfig),

    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 10,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URL'),
        connectionFactory: (connection) => {
          connection.plugin(softDeletePlugin);
          return connection;
        },
      }),
      inject: [ConfigService],
    }),

    ConfigModule.forRoot({
      isGlobal: true,
      load: [google_oauth_config],
    }),

    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        transport: {
          host: 'smtp.gmail.com',
          port: 465,
          secure: true,
          auth: {
            user: configService.get<string>('EMAIL_AUTH_USER'),
            pass: configService.get<string>('EMAIL_AUTH_PASS'),
          },
        },
        defaults: {
          from: 'minhlapro01@gmail.com',
        },
        template: {
          dir: process.cwd() + '/src/mail/templates/',
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
      inject: [ConfigService],
    }),

    UsersModule,
    AuthModule,
    FilesModule,
    DatabasesModule,
    HealthModule,
    ProductsModule,
    MembershipsModule,
    CategoriesModule,
    OrdersModule,
    PaymentsModule,
    CartsModule,
    ReviewsModule,
    VnpayModule,
    VouchersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
