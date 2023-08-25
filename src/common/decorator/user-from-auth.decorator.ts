import { getRequestUser } from '@/request/namespace';
import { createParamDecorator } from '@nestjs/common';
import { flatten, pick } from 'lodash';
import type { User } from '@/user/entities/user.entity';

export const AuthUser = createParamDecorator((keys: Array<keyof User>) => {
  const user = getRequestUser();
  if (keys?.length > 0) {
    return pick(user || {}, keys);
  }
  return user || {};
});

export const getUserFamiliesMembers = (user?: User) => {
  const familiesMembers = flatten(user?.families.map((family) => family.members) || []);
  if (familiesMembers.length > 0) {
    return familiesMembers;
  }
  return (user && [user]) || [];
};

export const AuthFamilyMembersId = createParamDecorator(() => {
  const user = getRequestUser();
  return getUserFamiliesMembers(user).map(({ id }) => id);
});
