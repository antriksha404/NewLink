import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

import { randomUUID } from 'crypto';

@Catch()
export class CatchEverythingFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}
  private readonly logger = new Logger(CatchEverythingFilter.name);
  // prettier-ignore
  catch(exception: any, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();
    const httpStatus = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;

    // Extract validation errors if they exist
    let errorMessage = exception.message;
    let validationErrors: string[] | null = null;
    const cause: any = null;
    if (exception instanceof HttpException) {
      const exceptionResponse = exception.getResponse();
      if (typeof exceptionResponse === 'object' && exceptionResponse !== null && Array.isArray(exceptionResponse['message'])) {
        validationErrors = exceptionResponse['message'] as string[];
        errorMessage = 'Validation Error';
      }
    }

    const responseBody = {
      validationErrors,
      message: errorMessage,
      statusCode: httpStatus,
      path: httpAdapter.getRequestUrl(ctx.getRequest()),
      timestamp: new Date().toISOString(),
      loggerID: randomUUID(),
      stack: exception.stack?.replace(/[\r\n]+/g, ' '),
      cause: cause?.response?.data ?? cause?.message,
    };

    // Log the error
    this.logger.error(`Error occurred: ${errorMessage}, LoggerID: ${responseBody.loggerID}`, responseBody);

    // In development, include the stack trace
    if (process.env.NODE_ENV === 'production') {
      delete responseBody.stack;
      delete responseBody.cause;
    }
    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}
