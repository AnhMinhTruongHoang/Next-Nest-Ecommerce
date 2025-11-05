import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { MembershipsService } from './memberships.service';
import { CreateMembershipDto } from './dto/create-membership.dto';
import { UpdateMembershipDto } from './dto/update-membership.dto';
import { Public, ResponseMessage, Users } from 'src/health/decorator/customize';
import { IUser } from 'src/types/user.interface';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt.auth.guard';
import { PreviewTierDto } from './dto/preview-tier.dto';

@ApiTags('memberships')
@UseGuards(JwtAuthGuard)
@Controller('memberships')
export class MembershipsController {
  constructor(private readonly membershipsService: MembershipsService) {}

  @Post()
  @ResponseMessage('Create new membership')
  create(@Body() dto: CreateMembershipDto, @Users() user: IUser) {
    return this.membershipsService.create(dto, user);
  }

  @Public()
  @Get('preview')
  @ResponseMessage('Preview tier by totalSpent')
  preview(@Query('t') t: string) {
    const totalSpent = Number(t || 0);
    return this.membershipsService.previewTier(totalSpent);
  }

  @Get()
  @ResponseMessage('Fetch memberships with paginate')
  findAll() {
    return this.membershipsService.findAll();
  }

  @Public()
  @Get('user/:userId')
  @ResponseMessage('Get tier of user')
  getTier(@Param('userId') userId: string) {
    return this.membershipsService.getTierByUser(userId);
  }

  @Public()
  @Get(':id')
  @ResponseMessage('Fetch membership by id')
  findOne(@Param('id') id: string) {
    return this.membershipsService.findOne(id);
  }

  @Patch(':id')
  @ResponseMessage('Update a membership')
  update(@Param('id') id: string, @Body() dto: UpdateMembershipDto) {
    return this.membershipsService.update(id, dto);
  }

  @Delete(':id')
  @ResponseMessage('Delete a membership')
  remove(@Param('id') id: string) {
    return this.membershipsService.remove(id);
  }
}
