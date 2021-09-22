import type { ExecutionContext } from '@nestjs/common';
import { createParamDecorator } from '@nestjs/common';
import { pick } from 'ramda';
import type { User } from '@/modules/user/entities/user.entity';
import type { Request } from '@/type/express';
import { getUserFamiliesMembers } from '@/utils/user.uti';

export const UserFromAuth = createParamDecorator(
  (keys: Array<keyof User> = [], ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    if (keys.length > 0) {
      return pick(keys)(request.user);
    }
    return request.user;
  },
);

export const FamilyMembersFromAuth = createParamDecorator((_: never, ctx: ExecutionContext) => {
  const { user } = ctx.switchToHttp().getRequest<Request>();
  return getUserFamiliesMembers(user);
});
