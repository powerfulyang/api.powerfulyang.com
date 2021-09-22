import { flatten } from 'ramda';
import type { User } from '@/modules/user/entities/user.entity';

export const getUserFamiliesMembers = (user: User) => {
  return flatten(user.families.map((family) => family.members));
};
