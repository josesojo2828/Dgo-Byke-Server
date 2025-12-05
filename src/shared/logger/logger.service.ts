import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class LoggerService extends Logger {
  logInfo(message: string, context?: string) {
    this.log(message, context);
  }

  logError(message: string, trace: string, context?: string) {
    this.error(message, trace, context);
  }

  logDebug(message: string, context?: string) {
    this.debug?.(message, context);
  }
}
