import type { ExecutionContext, ArgumentsHost } from '@nestjs/common';

type ContextType = 'http' | 'ws' | 'rpc' | 'graphql';

export const isGraphQLContext = (ctx: ExecutionContext | ArgumentsHost) => {
  return ctx.getType<ContextType>() === 'graphql';
};
