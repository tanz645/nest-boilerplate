import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { EmailAlreadyExistsException } from '../exceptions/email-already-exists.exception';
import { TeamLimitExceededException } from '../../team/exceptions/team-limit-exceeded.exception';
import { ErrorResponse } from '../types/api-response.types';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let error = 'Internal Server Error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      message = exception.message;
      error = this.getErrorType(status);
    } else if (exception instanceof EmailAlreadyExistsException) {
      status = HttpStatus.UNPROCESSABLE_ENTITY;
      message = exception.message;
      error = 'Validation Error';
    } else if (exception instanceof TeamLimitExceededException) {
      status = HttpStatus.FORBIDDEN;
      message = exception.message;
      error = 'Business Rule Violation';
    } else if (exception instanceof Error) {
      message = exception.message;
      error = 'Application Error';
    }

    const errorResponse: ErrorResponse = {
      success: false,
      message,
      error,
      statusCode: status,
    };

    response.status(status).json(errorResponse);
  }

  private getErrorType(status: number): string {
    const errorTypeMap: Record<number, string> = {
      [HttpStatus.BAD_REQUEST]: 'Bad Request',
      [HttpStatus.UNAUTHORIZED]: 'Unauthorized',
      [HttpStatus.FORBIDDEN]: 'Forbidden',
      [HttpStatus.NOT_FOUND]: 'Not Found',
      [HttpStatus.CONFLICT]: 'Conflict',
      [HttpStatus.UNPROCESSABLE_ENTITY]: 'Validation Error',
      [HttpStatus.TOO_MANY_REQUESTS]: 'Too Many Requests',
      [HttpStatus.INTERNAL_SERVER_ERROR]: 'Internal Server Error',
    };

    return errorTypeMap[status] || 'Error';
  }
}
