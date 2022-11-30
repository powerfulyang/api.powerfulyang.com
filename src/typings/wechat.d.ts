export interface WechatBaseResponse {
  errcode: number;
  errmsg: string;
}

export interface WechatCode2sessionResponse extends WechatBaseResponse {
  openid: string;
  session_key: string;
  unionid?: string;
}

export interface WechatGetAccessTokenResponse extends WechatBaseResponse {
  access_token: string;
  expires_in: number;
}

export interface WechatGetUnlimitedQRCodeRequest {
  /**
   * @description 最大32个可见字符，只支持数字，大小写英文以及部分特殊字符：!#$&'()*+,/:;=?@-._~，其它字符请自行编码为合法字符（因不支持%，中文无法使用 urlencode 处理，请使用其他编码方式）
   */
  scene: string;
  page?: string;
  check_path?: boolean;
  env_version?: 'develop' | 'trial' | 'release';
  width?: number;
  auto_color?: boolean;
  line_color?: {
    r: number;
    g: number;
    b: number;
  };
  is_hyaline?: boolean;
}

export interface WechatGetUnlimitedQRCodeResponse extends WechatBaseResponse {
  buffer: Buffer;
}

export interface WechatCheckSignatureRequest {
  signature: string;
  timestamp: string;
  nonce: string;
  echostr: string;
}

interface ListItem {
  TemplateId: string;
  SubscribeStatusString: string;
  PopupScene: string;
}

export interface WechatMiniProgramSubscribeMessageRequest {
  FromUserName: string;
  CreateTime: string;
  MsgType: string;
  Event: string;
  List: ListItem | ListItem[];
}

export type WechatMiniProgramMessageRequest = {
  ToUserName: string;
  Encrypt: string;
};

export type ReplySubscribeMessageRequest = {
  touser: string;
  template_id: string;
  page: string;
  data: Record<string, any>;
  miniprogram_state?: 'developer' | 'trial' | 'formal';
  lang?: 'zh_CN' | 'en_US' | 'zh_TW';
};
