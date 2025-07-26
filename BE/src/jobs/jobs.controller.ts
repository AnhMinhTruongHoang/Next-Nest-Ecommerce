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
import { JobsService } from './jobs.service';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { Public, ResponseMessage, Users } from 'src/decorator/customize';
import { IUser } from 'src/users/user.interface';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('jobs')
@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Post()
  @ResponseMessage('Create New Job')
  @Post()
  create(@Body() createJobDto: CreateJobDto, @Users() users: IUser) {
    return this.jobsService.create(createJobDto, users);
  }

  @Get()
  @Public()
  @ResponseMessage('Fetch Jobs with paginate')
  findAll(
    @Query('current') currentPage: string,
    @Query('pageSize') limit: string,
    @Query() qs: string,
  ) {
    return this.jobsService.findAll(+currentPage, +limit, qs);
  }

  @Get(':id')
  @Public()
  @ResponseMessage('fetch Jobs by id')
  async findOne(@Param('id') id: string) {
    const foundJob = await this.jobsService.findOne(id);
    return foundJob;
  }

  @ResponseMessage('Update a Jobs !')
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateJobDto: UpdateJobDto,
    @Users() users: IUser,
  ) {
    return this.jobsService.update(id, updateJobDto, users);
  }

  @ResponseMessage('Delete a Jobs')
  @Delete(':id')
  remove(@Param('id') id: string, @Users() user: IUser) {
    return this.jobsService.remove(id, user);
  }
}
