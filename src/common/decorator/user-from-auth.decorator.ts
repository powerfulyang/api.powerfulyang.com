import type { ExecutionContext } from '@nestjs/common';
import { createParamDecorator } from '@nestjs/common';
import { flatten, pick } from 'lodash';
import type { FastifyExtendRequest } from '@/type/FastifyExtendRequest';
import type { User } from '@/user/entities/user.entity';

export const AuthUser = createParamDecorator((keys: Array<keyof User>, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest<FastifyExtendRequest>();
  if (keys?.length > 0) {
    return pick(request.user || {}, keys);
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
  const { user } = ctx.switchToHttp().getRequest<FastifyExtendRequest>();
  return getUserFamiliesMembers(user).map(({ id }) => id);
});
