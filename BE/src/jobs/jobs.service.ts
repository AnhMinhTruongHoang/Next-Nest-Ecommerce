import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { ConfigService } from '@nestjs/config';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { Jobs, JobsDocument } from './schemas/job.schemas';
import { InjectModel } from '@nestjs/mongoose';
import { IUser } from 'src/users/user.interface';
import mongoose from 'mongoose';
import aqp from 'api-query-params';

@Injectable()
export class JobsService {
  constructor(
    @InjectModel(Jobs.name)
    private jobsModel: SoftDeleteModel<JobsDocument>,
    private configService: ConfigService,
  ) {}

  async create(createJobDto: CreateJobDto, users: IUser) {
    const {
      name,
      skills,
      company,
      location,
      salary,
      quantity,
      level,
      description,
      startDate,
      endDate,
    } = createJobDto;

    const isExist = await this.jobsModel.findOne({ name });
    if (isExist) {
      throw new BadRequestException(`The Jobs ${name} existing`);
    } ///////// check jobs if exist

    let newJobs = await this.jobsModel.create({
      name,
      skills,
      company,
      location,
      salary,
      quantity,
      level,
      description,
      startDate,
      endDate,
      createdBy: {
        _id: users._id,
        email: users.email,
      },
    });

    return newJobs;
  }

  async findAll(currentPage: number, limit: number, qs: string) {
    const { filter, sort, population } = aqp(qs);

    delete filter.current;
    delete filter.pageSize;

    let offset = (+currentPage - 1) * +limit;
    let defaultLimit = +limit ? +limit : 10;

    const totalItems = (await this.jobsModel.find(filter)).length;
    const totalPages = Math.ceil(totalItems / defaultLimit);

    const result = await this.jobsModel
      .find(filter)
      .skip(offset)
      .limit(defaultLimit)
      .sort(sort as any)
      .populate(population)
      .exec();

    return {
      meta: {
        current: currentPage, //trang hiện tại
        pageSize: limit, //số lượng bản ghi đã lấy
        pages: totalPages, //tổng số trang với điều kiện query
        total: totalItems, // tổng số phần tử (số bản ghi)
      },
      result, //kết quả query
    };
  }

  findOne(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) return 'Job not found';

    return this.jobsModel.findOne({
      _id: id,
    });
  }

  async update(id: string, updateJobDto: UpdateJobDto, users: IUser) {
    const update = await this.jobsModel.updateOne(
      { _id: id },
      {
        ...updateJobDto,
        updatedBy: {
          _id: users._id,
          email: users.email,
        },
      },
    );
    return update;
  }

  async remove(id: string, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return 'not found Jobs';
    }
    await this.jobsModel.updateOne(
      { _id: id },
      {
        deletedBy: {
          _id: user._id,
          email: user.email,
        },
      },
    );
    return this.jobsModel.softDelete({
      _id: id,
    });
  }
}
