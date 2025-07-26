import {
  IsEmail,
  IsMongoId,
  IsNotEmpty,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import mongoose from 'mongoose';

class UpdatedByDto {
  @IsNotEmpty({ message: '_id cannot be empty' })
  @IsMongoId({ message: '_id must be a valid Mongo ID' })
  _id: mongoose.Schema.Types.ObjectId;

  @IsNotEmpty({ message: 'Email cannot be empty' })
  @IsEmail({}, { message: 'Email must be valid' })
  email: string;
}

class HistoryDto {
  @IsNotEmpty({ message: 'Status cannot be empty' })
  @IsString({ message: 'Status must be a string' })
  status: string;

  @IsNotEmpty({ message: 'UpdatedAt cannot be empty' })
  updatedAt: Date;

  @IsNotEmpty({ message: 'UpdatedBy cannot be empty' })
  @ValidateNested()
  @Type(() => UpdatedByDto)
  updatedBy: UpdatedByDto;
}

export class CreateResumeDto {
  @IsEmail({}, { message: 'Email must be valid' })
  email: string;

  @IsNotEmpty({ message: 'User ID cannot be empty' })
  @IsMongoId({ message: 'User ID must be a valid Mongo ID' })
  userId: mongoose.Schema.Types.ObjectId;

  @IsNotEmpty({ message: 'URL cannot be empty' })
  @IsString({ message: 'URL must be a string' })
  url: string;

  @IsNotEmpty({ message: 'Status cannot be empty' })
  @IsString({ message: 'Status must be a string' })
  status: string;

  @IsNotEmpty({ message: 'Company ID cannot be empty' })
  @IsMongoId({ message: 'Company ID must be a valid Mongo ID' })
  companyId: mongoose.Schema.Types.ObjectId;

  @IsNotEmpty({ message: 'Job ID cannot be empty' })
  @IsString({ message: 'Job ID must be a string' })
  jobId: string;

  @IsNotEmpty({ message: 'History cannot be empty' })
  @ValidateNested()
  @Type(() => HistoryDto)
  history: HistoryDto;
}

export class CreateUserCvDto {
  @IsNotEmpty({ message: 'URL cannot be empty' })
  @IsString({ message: 'URL must be a string' })
  url: string;

  @IsNotEmpty({ message: 'Company ID cannot be empty' })
  @IsMongoId({ message: 'Company ID must be a valid Mongo ID' })
  companyId: mongoose.Schema.Types.ObjectId;

  @IsNotEmpty({ message: 'Job ID cannot be empty' })
  @IsMongoId({ message: 'Job ID must be a valid Mongo ID' })
  jobId: mongoose.Schema.Types.ObjectId;
}
