import { User } from '@/entity/user.entity';
import { flatten } from 'ramda';

export const getUserFamiliesMembers = (user: User) => {
  return flatten(user.families.map((family) => family.members));
};
