import { Body, Controller, HttpException, HttpStatus, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

import { SmsDTO } from '@/dto/plivo/sms.dto';
import { WhatsAppMessageDto } from '@/dto/plivo/whatsapp.dto';
import { PlivoService } from '@/services/plivo.service';

@Controller('notifications')
export class PlivoController {
  constructor(private readonly plivoService: PlivoService) {}
  @Post('sms')
  @ApiOperation({ summary: 'Send SMS using Plivo' })
  @ApiResponse({ status: 200, description: 'SMS sent successfully' })
  async sendSms(@Body() sms: SmsDTO): Promise<{ message: string }> {
    const { dst, text } = sms;
    const response = await this.plivoService.sendSms(dst, text);
    if (!response.success) {
      const error = response.error?.includes('not a valid phone number') ? response.error : 'Failed to send SMS';
      throw new HttpException(error, HttpStatus.BAD_REQUEST);
    }
    return { message: 'SMS sent successfully!' };
  }

  @Post('whatsapp')
  @ApiOperation({ summary: 'Send WhatsApp message using Plivo' })
  @ApiResponse({ status: 200, description: 'Message sent successfully' })
  async sendWhatsapp(@Body() messageDto: WhatsAppMessageDto) {
    const result = await this.plivoService.sendWhatsapp(
      messageDto.to,
      messageDto.header,
      messageDto.body,
      messageDto.templateName,
      messageDto.url,
    );
    if (!result.success) {
      throw new HttpException('Failed to send WhatsApp message', HttpStatus.BAD_REQUEST);
    }
    return { success: true, message: 'WhatsApp message sent successfully' };
  }
}
