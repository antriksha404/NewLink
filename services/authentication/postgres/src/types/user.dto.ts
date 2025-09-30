import { IsEmail, IsOptional, IsPhoneNumber, IsString } from 'class-validator';

export class UpdateUserDTO {
  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsPhoneNumber()
  phone?: string;

  @IsOptional()
  @IsString()
  password?: string;
}

export class DeleteUserDTO {
  @IsString()
  password: string;
}
