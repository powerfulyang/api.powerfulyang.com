import { SetMetadata } from '@nestjs/common';

export const ExcludeResponseInterceptorSymbol = Symbol('ExcludeResponseInterceptor');

export const ExcludeResponseInterceptorDecorator = () => {
  return SetMetadata(ExcludeResponseInterceptorSymbol, true);
};
