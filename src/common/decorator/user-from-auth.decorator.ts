import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { User } from '@/modules/user/entities/user.entity';
import { pick } from 'ramda';
import { Request } from '@/type/express';
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
