import { Module } from '@nestjs/common';
import { StatefulController } from './stateful.controller';
import { StatefulService } from './stateful.service';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './passport/stateful.local.strategy';
import { SessionSerializer } from './passport/stateful.session.serializer';
import { UsersModule } from 'src/users/users.module';

@Module({
  controllers: [StatefulController],
  providers: [StatefulService, LocalStrategy, SessionSerializer],
  imports: [UsersModule, PassportModule.register({ session: true })],
})
export class StatefulModule {}
