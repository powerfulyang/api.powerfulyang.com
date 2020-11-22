import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '@/entity/user.entity';
import { pick } from 'ramda';

export const UserFromAuth = createParamDecorator(
  (keys: Array<keyof User> = [], ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    if (keys.length > 0) {
      return pick(keys)(request.user);
    }
    return request.user;
  },
);
