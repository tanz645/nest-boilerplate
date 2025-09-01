import { CommonLogger } from './logger.service';

export class LoggerFactory {
  static createLogger(): CommonLogger {
    return new CommonLogger();
  }

  static getLogger(): CommonLogger {
    return new CommonLogger();
  }
}
