export class REDIS_KEYS {
  static USERS = 'users';

  static PATH_VIEW_COUNT_PREFIX = (path: string) => `path_view_count_prefix_${path}`;

  static SCHEDULE_NODE = 'schedule:node';

  static CHAT_GPT_CONVERSATIONS = 'chat-gpt:conversations';

  static CHAT_GPT_ACCESS_TOKEN = 'chat-gpt:access-token';

  static WECHAT_OFFICIAL_ACCOUNT_ACCESS_TOKEN = 'wechat:official-account:access-token';

  static WECHAT_MINI_PROGRAM_ACCESS_TOKEN = 'wechat:mini-program:access-token';
}
