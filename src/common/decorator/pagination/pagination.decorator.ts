import { Body, createParamDecorator, Query, ValidationPipe } from '@nestjs/common';
import { LoggerService } from '@/common/logger/logger.service';

export const QueryPagination = createParamDecorator(() => {
  return new ValidationPipe({ validateCustomDecorators: true });
}, [
  Query({
    transform(value) {
      const { current, pageSize, ...others } = value;
      const logger = new LoggerService('QUERY:Pagination Param Decorator');
      logger.debug(`params: ${JSON.stringify(value, undefined, 2)}`);
      return {
        take: Number(pageSize),
        skip: (Number(current) - 1) * Number(pageSize),
        ...others,
      };
    },
  }),
]);

export const BodyPagination = createParamDecorator(() => {
  return new ValidationPipe({ validateCustomDecorators: true });
}, [
  Body({
    transform(value) {
      const { current, pageSize, ...others } = value;
      const logger = new LoggerService('BODY:Pagination Param Decorator');
      logger.debug(`params: ${JSON.stringify(value, undefined, 2)}`);
      return {
        take: Number(pageSize),
        skip: (Number(current) - 1) * Number(pageSize),
        ...others,
      };
    },
  }),
]);
