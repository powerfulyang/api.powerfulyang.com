import type { User } from '@/modules/user/entities/user.entity';
import type { ExtendRequest } from '@/type/ExtendRequest';
import type { ExecutionContext } from '@nestjs/common';
import { createParamDecorator } from '@nestjs/common';
import { flatten, pick } from 'ramda';

export const AuthUser = createParamDecorator((keys: Array<keyof User>, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest<ExtendRequest>();
  if (keys?.length > 0) {
    return pick(keys)(request.user || {});
  }
  return request.user || {};
});

export const getUserFamiliesMembers = (user?: User) => {
  const familiesMembers = flatten(user?.families.map((family) => family.members) || []);
  if (familiesMembers.length > 0) {
    return familiesMembers;
  }
  return (user && [user]) || [];
};

export const AuthFamilyMembersId = createParamDecorator((_: never, ctx: ExecutionContext) => {
  const { user } = ctx.switchToHttp().getRequest<ExtendRequest>();
  return getUserFamiliesMembers(user).map(({ id }) => id);
});
