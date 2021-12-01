import type { ExecutionContext } from '@nestjs/common';
import { createParamDecorator } from '@nestjs/common';

export const Pagination = createParamDecorator((_data: number, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  const { currentPage = 1, pageSize = _data || 10 } = request.query;
  return { skip: (currentPage - 1) * pageSize, take: pageSize };
});

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type Pagination = {
  skip: number;
  take: number;
};
