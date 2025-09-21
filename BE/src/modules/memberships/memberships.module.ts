import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Membership, MembershipSchema } from './schema/membership.schema';
import { MembershipsService } from './memberships.service';
import { MembershipsController } from './memberships.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Membership.name, schema: MembershipSchema },
    ]),
  ],
  controllers: [MembershipsController],
  providers: [MembershipsService],
  exports: [MongooseModule, MembershipsService],
})
export class MembershipsModule {}
