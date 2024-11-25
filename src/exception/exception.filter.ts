import {
  ArgumentsHost,
  Catch,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { BaseExceptionFilter } from '@nestjs/core';

interface Body {
  statusCode: number;
  timestamp: string;
  path: string;
  response: string | object;
}

@Catch()
export class ExceptionFilter extends BaseExceptionFilter {
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
  }
}
