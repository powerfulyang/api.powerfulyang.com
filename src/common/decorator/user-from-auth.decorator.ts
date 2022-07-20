import type { ExecutionContext } from '@nestjs/common';
import { createParamDecorator } from '@nestjs/common';
import { flatten, pick } from 'ramda';
import type { User } from '@/modules/user/entities/user.entity';
import type { ExtendRequest } from '@/type/ExtendRequest';

export const UserFromAuth = createParamDecorator(
  (keys: Array<keyof User>, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<ExtendRequest>();
    if (keys?.length > 0) {
      return pick(keys)(request.user || {});
    }
    return request.user || {};
  },
);

export const UserIdFromAuth = createParamDecorator((_, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest<ExtendRequest>();
  return request.user?.id;
});

export const getUserFamiliesMembers = (user?: User) => {
  const familiesMembers = flatten(user?.families.map((family) => family.members) || []);
  if (familiesMembers.length > 0) {
    return familiesMembers;
  }
  return (user && [user]) || [];
};

export const FamilyMembersFromAuth = createParamDecorator((_: never, ctx: ExecutionContext) => {
  const { user } = ctx.switchToHttp().getRequest<ExtendRequest>();
  return getUserFamiliesMembers(user);
});

export const FamilyMembersIdFromAuth = createParamDecorator((_: never, ctx: ExecutionContext) => {
  const { user } = ctx.switchToHttp().getRequest<ExtendRequest>();
  return getUserFamiliesMembers(user).map(({ id }) => id);
});
