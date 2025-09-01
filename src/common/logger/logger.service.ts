import { Injectable, LoggerService } from '@nestjs/common';

@Injectable()
export class CommonLogger implements LoggerService {
  private getTimestamp(): string {
    return new Date().toISOString();
  }

  private formatMessage(
    level: string,
    message: string,
    context?: string,
  ): string {
    const timestamp = this.getTimestamp();
    const contextStr = context ? `[${context}]` : '';
    return `${timestamp} ${level} ${contextStr} ${message}`;
  }

  log(message: string, context?: string): void {
    console.log(this.formatMessage('LOG', message, context));
  }

  error(message: string, trace?: string, context?: string): void {
    console.error(this.formatMessage('ERROR', message, context));
    if (trace) {
      console.error(`Trace: ${trace}`);
    }
  }

  warn(message: string, context?: string): void {
    console.warn(this.formatMessage('WARN', message, context));
  }

  debug(message: string, context?: string): void {
    console.debug(this.formatMessage('DEBUG', message, context));
  }

  verbose(message: string, context?: string): void {
    console.log(this.formatMessage('VERBOSE', message, context));
  }
}
