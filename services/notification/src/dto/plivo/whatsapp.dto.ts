import { ApiProperty } from '@nestjs/swagger';

import { IsNotEmpty, IsOptional, IsString, Matches } from 'class-validator';

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
    description: 'Message content',
    example: '9403094',
  })
  @IsString()
  @IsNotEmpty()
  message: string;

  @ApiProperty({
    description: 'Template name',
    example: 'verification_code',
    required: false,
  })
  @IsString()
  @IsOptional()
  templateName?: string;
}
