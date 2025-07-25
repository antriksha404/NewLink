import { Body, Controller, Inject, Post } from '@nestjs/common';
import { EmailService } from '../services/email.service';
import { PlivoService } from '../services/plivo.service';

@Controller('notifications')
export class NotificationController {
	static SmsDTO: any;
	static EmailDTO: any;
	constructor(
		private readonly emailService: EmailService,
		private readonly plivoService: PlivoService,
		@Inject('EMAIL_DTO') private readonly EmailDTO: any,
		@Inject('SMS_DTO') private readonly SmsDTO: any,
	) {}
	@Post('email')
	async sendEmail(@Body() email: InstanceType<typeof this.EmailDTO>): Promise<{ message: string }> {
		const { to, subject, text, html } = email as typeof this.EmailDTO;
		await this.emailService.sendMail(to, subject, text, html);
		return { message: 'Email sent successfully!' };
	}
	@Post('sms')
	async sendSms(@Body() sms: InstanceType<typeof this.SmsDTO>): Promise<{ message: string }> {
		const { dst, text } = sms as typeof this.SmsDTO;
		await this.plivoService.sendSms(dst, text);
		return { message: 'SMS sent successfully!' };
	}

  @Post('whatsapp')
	async sendViaWhatsapp(@Body() sms: InstanceType<typeof this.SmsDTO>): Promise<{ message: string }> {
		const { to, message } = sms as typeof this.SmsDTO;
		await this.plivoService.sendWhatsapp(to, message);
		return { message: 'WhatsApp SMS sent successfully!' };
	}
}
