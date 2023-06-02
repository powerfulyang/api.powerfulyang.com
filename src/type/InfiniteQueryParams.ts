import type { User } from '@/user/entities/user.entity';

export type InfiniteQueryParams<T> = {
  prevCursor?: string | number;
  nextCursor?: string | number;
  take?: string | number;
} & T;

export type AuthorizationParams = {
  userIds?: User['id'][];
};

export const InfiniteQueryParamsSchema = () => {
  const _Class = new (class {})();
  Reflect.set(_Class, 'name', 'InfiniteQueryParamsSchema');
  return _Class;
};
