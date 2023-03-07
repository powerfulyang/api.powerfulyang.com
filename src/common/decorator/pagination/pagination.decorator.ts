import { Body, createParamDecorator, ValidationPipe } from '@nestjs/common';
import { LoggerService } from '@/common/logger/logger.service';

export const Pagination = createParamDecorator(() => {
  return new ValidationPipe({ validateCustomDecorators: true });
}, [
  Body({
    transform(value) {
      const { current, pageSize, ...others } = value;
      const logger = new LoggerService('Pagination Param Decorator');
      logger.debug(`params: ${JSON.stringify(value, undefined, 2)}`);
      return {
        take: Number(pageSize),
        skip: (Number(current) - 1) * Number(pageSize),
        ...others,
      };
    },
  }),
]);
