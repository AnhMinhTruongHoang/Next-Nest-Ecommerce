import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEmail,
  IsMongoId,
  IsNotEmpty,
  IsNotEmptyObject,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import mongoose from 'mongoose';

class Company {
  @IsOptional()
  _id?: mongoose.Schema.Types.ObjectId;

  @IsOptional()
  name?: string;
}

export class CreateUserDto {
  @IsNotEmpty({
    message: "Email can't be empty",
  })
  @IsEmail()
  email: string;

  @IsNotEmpty({ message: 'password should not be empty' })
  password: string;

  @IsNotEmpty({ message: "Name mustn't empty" })
  name?: string;

  @IsOptional()
  age?: number;

  @IsOptional()
  gender?: string;

  @IsOptional()
  phone?: number;

  @IsOptional()
  address?: string;

  @IsNotEmpty({ message: "Role mustn't empty" })
  @IsMongoId({ message: "Role mustn't mongo ID" })
  role: string;

  @IsOptional()
  @IsString()
  avatarUrl?: string;

  @ApiProperty({ required: false, type: () => Company })
  @IsOptional()
  @ValidateNested()
  @Type(() => Company)
  company?: Company;
}

///////////// register valid

export class RegisterUserDto {
  @IsNotEmpty({ message: "Name mustn't empty" })
  name?: string;

  @IsNotEmpty({
    message: "Email can't be empty",
  })
  @IsEmail()
  email: string;

  @IsNotEmpty({ message: 'password should not be empty' })
  password: string;

  @IsOptional()
  age?: number;

  @IsOptional()
  gender?: string;

  @IsOptional()
  address?: string;

  phone?: number;
}

//create-user.dto
export class UserLoginDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'anhminh', description: 'username' })
  readonly username: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    example: '123456',
    description: 'password',
  })
  readonly password: string;
}

/////// google login
export class LoginWithGoogleDto {
  @IsEmail()
  email: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  avatarUrl?: string;

  @IsOptional()
  @IsString()
  password?: string;
}
