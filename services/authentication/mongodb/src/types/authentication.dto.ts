import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsString, ValidateIf } from 'class-validator';

export class RegisterDTO {
  @ApiProperty({
    description: 'The first name of the user',
    example: 'John',
  })
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty({
    description: 'The last name of the user',
    example: 'Doe',
  })
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({
    description: 'The phone number of the user (without + prefix)',
    example: '1234567890',
  })
  @IsString()
  @IsNotEmpty()
  @Transform(({ value }) => value?.replace('+', ''))
  phone: string;

  @ApiProperty({
    description: 'The email of the user',
    example: 'john.doe@example.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'The password of the user',
    example: 'password',
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}

export class LoginDTO {
  @ApiProperty({
    description: 'The email of the user',
    example: 'john.doe@example.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty({
    description: 'The password of the user',
    example: 'password',
  })
  @IsString()
  @IsNotEmpty()
  password: string;
}

export class TokenDTO {
  @ApiProperty({
    description: 'The token of the user',
    example: 'token',
  })
  @IsString()
  @IsNotEmpty()
  token: string;
}

export class GenerateOtpDTO {
  @ApiProperty({
    description: 'The email of the user',
    example: 'john.doe@example.com',
  })
  @IsEmail()
  @ValidateIf((o) => !o.phone)
  @IsNotEmpty()
  email?: string;

  @ApiProperty({
    description: 'The phone number of the user',
    example: '+1234567890',
  })
  @IsString()
  @ValidateIf((o) => !o.email)
  @IsNotEmpty()
  @Transform(({ value }) => value?.replace('+', ''))
  phone?: string;
}

export class VerifyOtpDTO {
  @ApiProperty({
    description: 'The reference id of the user',
    example: '1234567890',
  })
  @IsString()
  @IsNotEmpty()
  referenceId: string;

  @ApiProperty({
    description: 'The otp of the user',
    example: '123456',
  })
  @IsString()
  @IsNotEmpty()
  otp: string;
}
