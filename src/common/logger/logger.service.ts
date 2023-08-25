import { loggerInstance } from '@/common/logger/loggerInstance';
import { Injectable, Optional, Scope } from '@nestjs/common';
import type { Logger } from 'winston';

@Injectable({ scope: Scope.TRANSIENT })
export class LoggerService {
  private readonly logger: Logger = loggerInstance;

  private context: string;

  constructor(@Optional() private readonly ctx?: string) {
    this.context = this.ctx || 'LoggerService';
  }

  setContext(context: string) {
    this.context = context;
  }

  error(message: string, stack?: Error, context?: string): void;
  error(error: Error): void;
  error(error: any): void;
  error(error: Object, stack?: Error, context?: string): void;

  error(error: Error | string | Object, stack?: Error, context?: string) {
    let logObject;

    if (error instanceof Error) {
      logObject = {
        ...error,
        context: context || this.context,
        stack: error.stack,
        message: error.message,
      };
    } else if (typeof error === 'object') {
      logObject = { ...error, stack, context: context || this.context };
    } else {
      logObject = { context: context || this.context, message: error, stack };
    }

    this.logger.error(logObject);
  }

  warn(message: string, context?: string) {
    this.logger.warn({ context: context || this.context, message });
  }

  info(message: string, context?: string) {
    this.logger.info({ context: context || this.context, message });
  }

  debug(message: string, context?: string) {
    this.logger.debug({ context: context || this.context, message });
  }

  verbose(message: string, context?: string) {
    this.logger.verbose({ context: context || this.context, message });
  }

  log(message: string, context?: string) {
    this.logger.verbose({ context: context || this.context, message });
  }
}
