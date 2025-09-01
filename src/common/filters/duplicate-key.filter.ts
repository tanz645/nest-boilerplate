import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { MongoError } from 'mongodb';
import { ErrorResponse } from '../types/api-response.types';

@Catch(MongoError)
export class DuplicateKeyFilter implements ExceptionFilter {
  catch(exception: MongoError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    // Check if this is a duplicate key error (error code 11000)
    if (exception.code === 11000) {
      // Extract field name from the error message
      const errorResponse: ErrorResponse = {
        success: false,
        message: `Already exists`,
        error: 'Conflict',
        statusCode: HttpStatus.CONFLICT,
      };

      return response.status(HttpStatus.CONFLICT).json(errorResponse);
    }

    // If it's not a duplicate key error, let it pass through to the global filter
    throw exception;
  }
}
