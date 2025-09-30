import { Controller, Get } from '@nestjs/common';

@Controller('app')
export class AppController {
  constructor() {}

  @Get('health')
  checkHealth() {
    return {
      status: 'ok',
    };
  }
}
