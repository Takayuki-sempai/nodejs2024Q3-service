import {
  ArgumentsHost,
  Catch,
  HttpException,
  HttpStatus
} from '@nestjs/common';
import { Request, Response } from 'express';
import { BaseExceptionFilter } from '@nestjs/core';
import { LoggingService } from '../logging/logging.service';

interface Body {
  statusCode: number;
  timestamp: string;
  path: string;
  response: string | object;
}

@Catch()
export class ExceptionFilter extends BaseExceptionFilter {
  private readonly logger = new LoggingService('ErrorResponse');

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const body: Body = {
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      timestamp: new Date().toISOString(),
      path: request.url,
      response: 'Internal Server Error',
    };

    if (exception instanceof HttpException) {
      body.statusCode = exception.getStatus();
      body.response = exception.getResponse();
    }

    response.status(body.statusCode).json(body);

    const errorMessage = this.generateErrorMessage(request, body);

    if (body.statusCode < 500) {
      this.logger.warn(errorMessage);
    } else {
      this.logger.error(errorMessage);
    }
  }

  private generateErrorMessage(
    { url, method }: Request,
    { statusCode, response }: Body,
  ) {
    return `{ url: ${url}, method: ${method}, status: ${statusCode} } response: ${JSON.stringify(response)}`;
  }
}
