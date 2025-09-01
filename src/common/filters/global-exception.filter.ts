import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { Response } from 'express';
import { ErrorResponse } from '../types/api-response.types';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
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

      // Handle validation errors specifically
      if (exception instanceof BadRequestException) {
        const exceptionResponse = exception.getResponse() as any;
        if (
          exceptionResponse.errors &&
          Array.isArray(exceptionResponse.errors)
        ) {
          // Format validation errors into a readable message
          const errorMessages = exceptionResponse.errors
            .map((err: any) => `${err.field}: ${err.message}`)
            .join('; ');
          message = `Validation failed: ${errorMessages}`;
        }
      }
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
