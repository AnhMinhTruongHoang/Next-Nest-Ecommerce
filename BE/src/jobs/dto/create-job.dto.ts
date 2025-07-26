import { Type } from 'class-transformer';
import {
  IsNotEmpty,
  IsNotEmptyObject,
  IsNumber,
  IsObject,
  IsString,
  IsArray,
  IsBoolean,
  IsMongoId,
  ValidateNested,
} from 'class-validator';

class Company {
  @IsMongoId({ message: 'Invalid company ID' })
  _id: string;

  @IsNotEmpty({ message: "Company name can't be empty" })
  @IsString()
  name: string;
}

export class CreateJobDto {
  @IsNotEmpty({ message: "Name can't be empty" })
  @IsString()
  name: string;

  @IsArray()
  @IsNotEmpty({ message: 'Skills array must not be empty' })
  skills: string[];

  @IsNotEmptyObject()
  @IsObject()
  @ValidateNested()
  @Type(() => Company)
  company: Company;

  @IsNotEmpty({ message: "Location can't be empty" })
  @IsString()
  location: string;

  @IsNotEmpty({ message: 'Salary must be set' })
  @IsNumber()
  salary: number;

  @IsNotEmpty({ message: 'Quantity must be set' })
  @IsNumber()
  quantity: number;

  @IsNotEmpty({ message: 'Level must be set' })
  @IsString()
  level: string;

  @IsNotEmpty({ message: "Description can't be empty" })
  @IsString()
  description: string;

  @IsNotEmpty({ message: 'logo is empty' })
  logo: string;

  @IsNotEmpty({ message: 'Start date must be set' })
  @IsNumber()
  startDate: number;

  @IsNotEmpty({ message: 'End date must be set' })
  @IsNumber()
  endDate: number;

  @IsBoolean()
  isActive: boolean;
}
