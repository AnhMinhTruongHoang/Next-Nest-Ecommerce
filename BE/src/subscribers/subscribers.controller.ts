import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { SubscribersService } from './subscribers.service';
import { CreateSubscriberDto } from './dto/create-subscriber.dto';
import { UpdateSubscriberDto } from './dto/update-subscriber.dto';
import {
  Public,
  ResponseMessage,
  SkipCheckPermission,
  Users,
} from 'src/decorator/customize';
import { IUser } from 'src/users/user.interface';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('subscribers')
@Controller('subscribers')
export class SubscribersController {
  constructor(private readonly subscribersService: SubscribersService) {}

  @Post()
  @ResponseMessage('Create New Subscriber')
  create(
    @Body() createSubscriberDto: CreateSubscriberDto,
    @Users() user: IUser,
  ) {
    return this.subscribersService.create(createSubscriberDto, user);
  }

  @Get()
  @Public()
  @ResponseMessage('Fetch Subscriber with paginate')
  findAll(
    @Query('current') currentPage: string,
    @Query('pageSize') limit: string,
    @Query() qs: string,
  ) {
    return this.subscribersService.findAll(+currentPage, +limit, qs);
  }

  @Post('skills')
  @ResponseMessage("Get subscriber's skills")
  @SkipCheckPermission()
  getUserSkills(@Users() user: IUser) {
    return this.subscribersService.getSkills(user);
  }

  @Get(':id')
  @Public()
  @ResponseMessage('fetch Jobs by id')
  async findOne(@Param('id') id: string) {
    const foundJob = await this.subscribersService.findOne(id);
    return foundJob;
  }

  @ResponseMessage('Update a Subscriber !')
  @SkipCheckPermission()
  update(
    @Body() updateSubscriberDto: UpdateSubscriberDto,
    @Users() user: IUser,
  ) {
    return this.subscribersService.update(updateSubscriberDto, user);
  }

  @ResponseMessage('Delete a Jobs')
  @Delete(':id')
  remove(@Param('id') id: string, @Users() user: IUser) {
    return this.subscribersService.remove(id, user);
  }
}
