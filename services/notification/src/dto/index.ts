import { EmailDTO } from './email.dto';
import { SmsDto } from 'dto/sms.dto';

export const DefaultDTO = [
    {
        provide: 'EMAIL_DTO',
        useValue: EmailDTO
    },
    {
        provide: 'SMS_DTO',
        useValue: SmsDto
    }
];