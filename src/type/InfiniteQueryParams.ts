import type { User } from '@/modules/user/entities/user.entity';

export type InfiniteQueryParams<T> = {
  prevCursor?: string | number;
  nextCursor?: string | number;
  take?: string | number;
} & T;

export type AuthorizationParams = {
  userIds?: User['id'][];
};

export const DefaultCursor = 2 ** 31 - 1;

export const DefaultTake = 10;
