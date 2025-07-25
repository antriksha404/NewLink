import { Inject, Injectable } from '@nestjs/common';

import * as plivo from 'plivo';

@Injectable()
export class PlivoService {
  constructor(
    @Inject('PLIVO_CLIENT') private readonly client: plivo.Client,
    @Inject('PLIVO_FROM_NUMBER') private readonly fromWhatsappNumber: string,
    @Inject('PLIVO_FROM_NUMBER') private readonly fromSmsNumber: string,
  ) {}

  async sendSms(dst: string, text: string) {
    try {
      const fromNumber = `+${this.fromSmsNumber.replace('+', '')}`;
      console.log('fromNumber', fromNumber);
      await this.client.messages.create(fromNumber, dst, text);
      return { success: true };
    } catch (error: unknown) {
      console.info(
        '[PlivoService] Failed to send SMS:',
        error instanceof Error ? error.message : 'Unknown error', // NOSONAR
      );
      return { error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  async sendWhatsapp(to: string, content: string, templateName = 'verification_code') {
    try {
      const fromNumber = `+${this.fromWhatsappNumber.replace('+', '')}`;
      const optionalParams = {
        type: 'whatsapp',
        template: {
          name: templateName,
          language: 'en_US',
          components: [
            {
              type: 'body',
              parameters: [{ type: 'text', text: content }],
            },
          ],
        },
      };
      await this.client.messages.create(fromNumber, to, content, optionalParams);
      return { success: true };
    } catch (error: unknown) {
      console.info('[PlivoService] Failed to send WhatsApp message:', error instanceof Error ? error.message : 'Unknown error');
      return { error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }
}
