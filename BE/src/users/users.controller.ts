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
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Public, ResponseMessage, Users } from 'src/decorator/customize';
import { IUser } from './user.interface';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ResponseMessage('Create New User')
  async create(
    @Body()
    createUserDto: CreateUserDto,
    @Users() user: IUser,
  ) {
    let NewUser = await this.usersService.create(createUserDto, user);
    return {
      _id: NewUser?._id,
      createdAt: NewUser?.createdAt,
      createdBy: NewUser?.createdBy,
    };
  }

  @Get()
  @ResponseMessage('Fetch user with paginate')
  findAll(
    @Query('current') currentPage: string,
    @Query('pageSize') limit: string,
    @Query() qs: string,
  ) {
    return this.usersService.findAll(+currentPage, +limit, qs);
  }

  @Public()
  @ResponseMessage('fetch user by id')
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const foundUser = this.usersService.findOne(id);
    return foundUser;
  }

  @Patch(':id')
  @ResponseMessage('Update a User')
  async update(
    @Body() updateUserDto: UpdateUserDto,
    @Users() users: IUser,
    @Param('id') id: string,
  ) {
    let updateUser = await this.usersService.update(updateUserDto, users, id);

    return updateUser;
  }

  @Delete(':id')
  @ResponseMessage('Delete a USer')
  remove(@Param('id') id: string, @Users() users: IUser) {
    return this.usersService.remove(id, users);
  }
}
