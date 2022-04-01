import type { ExecutionContext } from '@nestjs/common';
import { createParamDecorator } from '@nestjs/common';

export const QueryPagination = createParamDecorator((_data: number, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  const { currentPage = 1, pageSize = _data || 10 } = request.query;
  return { skip: (currentPage - 1) * pageSize, take: pageSize };
});

export type Pagination = {
  skip: number;
  take: number;
};
