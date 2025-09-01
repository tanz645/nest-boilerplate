import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Request } from 'express';
import { ApiResponse } from '../types/api-response.types';

@Injectable()
export class ResponseInterceptor<T>
  implements NestInterceptor<T, ApiResponse<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ApiResponse<T>> {
    const request = context.switchToHttp().getRequest<Request>();

    return next.handle().pipe(
      map((data) => ({
        success: true,
        message: this.getSuccessMessage(request.method, request.url),
        data,
      })),
    );
  }

  private getSuccessMessage(method: string, url: string): string {
    const resource = this.getResourceFromUrl(url);

    switch (method) {
      case 'POST':
        return `${resource} created successfully`;
      case 'GET':
        return `${resource} retrieved successfully`;
      case 'PATCH':
      case 'PUT':
        return `${resource} updated successfully`;
      case 'DELETE':
        return `${resource} deleted successfully`;
      default:
        return 'Operation completed successfully';
    }
  }

  private getResourceFromUrl(url: string): string {
    const segments = url.split('/').filter(Boolean);
    if (segments.length > 0) {
      const resource = segments[0];
      return resource.charAt(0).toUpperCase() + resource.slice(1);
    }
    return 'Resource';
  }
}
