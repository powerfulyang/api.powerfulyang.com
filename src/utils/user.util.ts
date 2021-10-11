import { flatten } from 'ramda';
import type { User } from '@/modules/user/entities/user.entity';

export const getUserFamiliesMembers = (user: User) => {
  const users = flatten(user?.families?.map((family) => family.members) || []);
  return users.length ? users : [user];
};
