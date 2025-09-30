import { Controller, Get } from '@nestjs/common';

/**
 * Controller for application-level endpoints.
 */
@Controller()
export class AppController {
  constructor() {}

  /**
   * Checks the health status of the application.
   * @returns Object containing status information.
   */
  @Get('health')
  checkHealth() {
    return {
      status: 'OK',
    };
  }
}
