import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

import { EmailDTO } from '@/dto/email.dto';
import { EmailService } from '@/services/email.service';

@Controller('notifications')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  @Post('email')
  @ApiOperation({ summary: 'Send email' })
  @ApiResponse({ status: 200, description: 'Email sent successfully' })
  async sendEmail(@Body() email: EmailDTO): Promise<{ message: string }> {
    const { to, subject, text, html } = email;
    await this.emailService.sendMail(to, subject, text, html);
    return { message: 'Email sent successfully! ' };
  }
}
