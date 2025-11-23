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
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Public, ResponseMessage, Users } from 'src/health/decorator/customize';
import { IUser } from 'src/types/user.interface';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt.auth.guard';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ResponseMessage('Create New User')
  async create(@Body() createUserDto: CreateUserDto) {
    const newUser = await this.usersService.create(createUserDto);
    return {
      _id: newUser?._id,
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
  async(@Param('id') id: string) {
    const foundUser = this.usersService.findOne(id);
    return foundUser;
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Users() user: IUser,
  ) {
    return this.usersService.update(updateUserDto, user, id);
  }

  @Delete(':id')
  @ResponseMessage('Delete a User')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
