import { IsNotEmpty } from 'class-validator';

export class CreateCompanyDto {
  @IsNotEmpty({ message: "name can't be empty" })
  name: string;

  @IsNotEmpty({ message: 'address should not be empty' })
  address: string;

  @IsNotEmpty({ message: 'description should not be empty' })
  description: string;

  @IsNotEmpty({ message: 'logo should not be empty' })
  logo: string;
}
