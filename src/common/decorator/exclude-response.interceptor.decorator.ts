import { SetMetadata } from '@nestjs/common';

export const ExcludeResponseInterceptorSymbol = Symbol('ExcludeResponseInterceptor');

export const ExcludeResponseInterceptor = () => {
  return SetMetadata(ExcludeResponseInterceptorSymbol, true);
};
