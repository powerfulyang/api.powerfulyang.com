import type { ExecutionContext } from '@nestjs/common';
import { Body, createParamDecorator } from '@nestjs/common';
import type { FastifyRequest } from 'fastify';

export const Pagination = createParamDecorator(
  (_, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<FastifyRequest>();
    // @ts-ignore
    const { current, pageSize, ...others } = request.body || {};
    return {
      take: Number(pageSize),
      skip: (Number(current) - 1) * Number(pageSize),
      ...others,
    };
  },
  [Body()],
);
