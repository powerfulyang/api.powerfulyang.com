import type { AccessRequest } from '@/common/authorization/access-guard';
import type { ExecutionContext } from '@nestjs/common';
import { createParamDecorator } from '@nestjs/common';
import { flatten, pick } from 'lodash';
import type { User } from '@/user/entities/user.entity';

export const AuthUser = createParamDecorator(
  (keys: Array<keyof User>, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest<AccessRequest>();
    const { user } = request;
    if (keys?.length > 0) {
      return pick(user || {}, keys);
    }
    return user || {};
  },
);

export const getUserFamiliesMembers = (user?: User) => {
  const familiesMembers = flatten(user?.families.map((family) => family.members) || []);
  if (familiesMembers.length > 0) {
    return familiesMembers;
  }
  return (user && [user]) || [];
};

export const AuthFamilyMembersId = createParamDecorator((_: never, context: ExecutionContext) => {
  const request = context.switchToHttp().getRequest<AccessRequest>();
  const { user } = request;
  return getUserFamiliesMembers(user).map(({ id }) => id);
});
