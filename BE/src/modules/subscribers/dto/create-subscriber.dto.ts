import { IsArray, IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateSubscriberDto {
  @IsNotEmpty({ message: "Company name can't be empty" })
  @IsEmail()
  email: string;

  @IsNotEmpty({ message: "Company name can't be empty" })
  @IsString()
  name: string;

  @IsArray()
  @IsNotEmpty({ message: 'Skills array must not be empty' })
  skills: string[];
}
