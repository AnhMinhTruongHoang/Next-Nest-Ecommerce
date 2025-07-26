import { IsNotEmpty } from 'class-validator';

// Data Transfer Object (DTO) // class = { }

export class CreatePermissionDto {
  @IsNotEmpty({ message: 'Name must not be empty' })
  name: string;

  @IsNotEmpty({ message: 'API path must not be empty' })
  apiPath: string;

  @IsNotEmpty({ message: 'Method must not be empty' })
  method: string;

  @IsNotEmpty({ message: 'Module must not be empty' })
  module: string;
}
