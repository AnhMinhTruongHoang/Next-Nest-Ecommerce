import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { User, UserDocument } from 'src/users/schemas/user.schema';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class DatabasesService implements OnModuleInit {
  private readonly logger = new Logger(DatabasesService.name);

  constructor(
    @InjectModel(User.name)
    private userModel: SoftDeleteModel<UserDocument>,

    private configService: ConfigService,
    private userService: UsersService,
  ) {}

  async onModuleInit() {
    const isInit = this.configService.get<string>('SHOULD_INIT');
    if (!isInit || isInit === 'false') return;

    const countUser = await this.userModel.count();

    if (countUser === 0) {
      const initPassword = this.userService.getHashPassword(
        this.configService.get<string>('INIT_PASSWORD'),
      );

      await this.userModel.insertMany([
        {
          name: "I'm admin",
          email: 'admin@gmail.com',
          password: initPassword,
          age: 69,
          gender: 'MALE',
          address: 'VietNam',
          role: 'ADMIN',
          isActive: true,
        },
        {
          name: "I'm Hỏi Dân IT",
          email: 'hoidanit@gmail.com',
          password: initPassword,
          age: 96,
          gender: 'MALE',
          address: 'VietNam',
          role: 'ADMIN',
          isActive: true,
        },
        {
          name: "I'm normal user",
          email: 'user@gmail.com',
          password: initPassword,
          age: 69,
          gender: 'MALE',
          address: 'VietNam',
          role: 'USER',
          isActive: true,
        },
      ]);

      this.logger.log('>>> INIT USERS DONE...');
    } else {
      this.logger.log('>>> USERS ALREADY EXIST, SKIP INIT...');
    }
  }
}
