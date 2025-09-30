import { ApiProperty } from '@nestjs/swagger';

import { IsArray, IsNotEmpty, IsOptional, IsString, Matches } from 'class-validator';

export class WhatsAppMessageDto {
  @ApiProperty({
    description: 'Phone number with country code',
    example: '+918827046218',
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^\+\d{10,15}$/, {
    message: 'Phone number must start with + and contain 10-15 digits',
  })
  to: string;

  @ApiProperty({
    description: 'Body content',
    example: ['9403094', '9403094'],
  })
  @IsArray()
  @IsNotEmpty()
  body: string[];

  @ApiProperty({
    description: 'Header content',
    example: ['9403094', '9403094'],
  })
  @IsArray()
  @IsNotEmpty()
  header: string[];

  @ApiProperty({
    description: 'URL content',
    example: ['https://www.google.com', 'https://www.google.com'],
  })
  @IsArray()
  @IsNotEmpty()
  url: string[];

  @ApiProperty({
    description: 'Template name',
    example: 'verification_code',
    required: false,
  })
  @IsString()
  @IsOptional()
  templateName?: string;
}
