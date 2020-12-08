export class REDIS_KEYS {
  static USERS = 'users';

  static PATH_VIEW_COUNT_PREFIX = (path: string) => {
    return `path_view_count_prefix_${path}`;
  };
}
