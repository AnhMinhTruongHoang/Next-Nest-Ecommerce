import { Module } from '@nestjs/common';
import { StatelessController } from './stateless.controller';
import { StatelessService } from './stateless.service';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './passport/stateless.local.strategy';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtStrategy } from './passport/stateless.jwt.strategy';

import ms from 'ms';
import { UsersModule } from 'src/users/users.module';
@Module({
  controllers: [StatelessController],
  providers: [StatelessService, LocalStrategy, JwtStrategy],
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.registerAsync({
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_ACCESS_TOKEN_SECRET'),
        signOptions: {
          expiresIn: ms(configService.get<string>('JWT_ACCESS_EXPIRED_IN')),
        },
      }),
      inject: [ConfigService],
    }),
  ],
})
export class StatelessModule {}
