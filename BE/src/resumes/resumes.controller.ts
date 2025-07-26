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
import { ResumesService } from './resumes.service';
import { CreateUserCvDto } from './dto/create-resume.dto';
import { Public, ResponseMessage, Users } from 'src/decorator/customize';
import { IUser } from 'src/users/user.interface';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('resumes')
@Controller('resumes')
export class ResumesController {
  constructor(private readonly resumesService: ResumesService) {}

  @Post()
  @ResponseMessage('Create New resume')
  async create(@Body() createUserCvDto: CreateUserCvDto, @Users() user: IUser) {
    return this.resumesService.create(createUserCvDto, user);
  }

  @Post('by-user')
  @ResponseMessage('Get Resumes by User')
  getResumesByUser(@Users() user: IUser) {
    return this.resumesService.findByUsers(user);
  }

  @Get()
  @ResponseMessage('Fetch Resume with paginate')
  findAll(
    @Query('current') currentPage: string,
    @Query('pageSize') limit: string,
    @Query() qs: string,
  ) {
    return this.resumesService.findAll(+currentPage, +limit, qs);
  }

  @Public()
  @ResponseMessage('fetch user by id')
  @Post(':id')
  async findOne(@Param('id') id: string) {
    const foundUser = this.resumesService.findOne(id);
    return foundUser;
  }

  @Patch(':id')
  @ResponseMessage('Update New resume')
  update(
    @Param('id') id: string,
    @Body('status') status: string,
    @Users() user: IUser,
  ) {
    return this.resumesService.update(id, status, user);
  }

  @Delete(':id')
  @ResponseMessage('Delete Resume by Id')
  remove(@Param('id') id: string, @Users() user: IUser) {
    return this.resumesService.remove(id, user);
  }
}
