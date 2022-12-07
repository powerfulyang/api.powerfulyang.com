import type { ExecutionContext } from '@nestjs/common';
import { createParamDecorator } from '@nestjs/common';
import type { FastifyRequest } from 'fastify';

export const Pagination = createParamDecorator((_, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest<FastifyRequest>();
  const { current, pageSize, ...others } = request.body as any;
  return {
    take: Number(pageSize),
    skip: (Number(current) - 1) * Number(pageSize),
    ...others,
  };
});
