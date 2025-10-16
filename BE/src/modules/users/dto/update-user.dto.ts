import { IsEmail, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsNumber()
  phone?: number;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsEmail({}, { message: 'Email must be an email' })
  email?: string;

  @IsOptional()
  age?: number;
}
