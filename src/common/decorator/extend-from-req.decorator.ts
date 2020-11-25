import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { pick } from 'ramda';
import { ReqExtend } from '@/type/ReqExtend';

export const ExtendFromReq = createParamDecorator(
  (keys: Array<keyof ReqExtend> = [], ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    if (keys.length > 0) {
      return pick(keys)(request.extend);
    }
    return request.extend;
  },
);
