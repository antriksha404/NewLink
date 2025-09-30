import { Inject, Injectable } from '@nestjs/common';

import * as plivo from 'plivo';

@Injectable()
export class PlivoService {
  constructor(
    @Inject('PLIVO_CLIENT') private readonly client: plivo.Client,
    @Inject('PLIVO_FROM_WHATSAPP_NUMBER') private readonly fromWhatsappNumber: string,
    @Inject('PLIVO_FROM_NUMBER') private readonly fromSmsNumber: string,
  ) {}

  async sendSms(dst: string, text: string) {
    try {
      const fromNumber = `+${this.fromSmsNumber.replace('+', '')}`;
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

  async sendWhatsapp(
    to: string,
    header: string[] = [],
    body: string[] = [],
    templateName = 'verification_code',
    url: string[] = [],
  ) {
    try {
      const components: { type: string; sub_type?: string; index?: string; parameters: { type: string; text: string }[] }[] = [];
      if (header.length > 0) {
        components.push({
          type: 'header',
          parameters: header.map((text) => ({ type: 'text', text })),
        });
      }
      if (body.length > 0) {
        components.push({
          type: 'body',
          parameters: body.map((text) => ({ type: 'text', text })),
        });
      }
      if (url.length > 0) {
        components.push({
          type: 'button',
          sub_type: 'url',
          index: '0',
          parameters: url.map((text) => ({ type: 'text', text })),
        });
      }

      // 2. Construct the final template object

      await this.client.messages.create(`+${this.fromWhatsappNumber.replace('+', '')}`, `+${to.replace('+', '')}`, '', {
        template: {
          name: templateName,
          language: 'en_US',
          components: components,
        },
        type: 'whatsapp',
      });
      return { success: true };
    } catch (error: unknown) {
      console.info('[PlivoService] Failed to send WhatsApp message:', error instanceof Error ? error.message : 'Unknown error');
      return { error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }
}
