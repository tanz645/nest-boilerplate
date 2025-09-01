import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CommonLogger } from '../logger/logger.service';

@Injectable()
export class ErrorLoggingInterceptor implements NestInterceptor {
  private readonly logger = new CommonLogger();

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const { method, url, ip, userAgent } = request;
    const user = request.user;

    return next.handle().pipe(
      catchError((error) => {
        // Combine all error information into one comprehensive log
        const errorDetails = {
          request: `${method} ${url}`,
          ip,
          userAgent,
          user: user
            ? `${user.id} (${user.email}, ${user.role})`
            : 'Not authenticated',
          error: error.message,
          stack: error.stack,
        };

        this.logger.error(
          `Request failed: ${errorDetails.request} - IP: ${errorDetails.ip} - User: ${errorDetails.user} - Error: ${errorDetails.error}`,
          errorDetails.stack,
          'ErrorLoggingInterceptor',
        );

        // Re-throw the error to maintain the original error flow
        return throwError(() => error as Error);
      }),
    );
  }
}
