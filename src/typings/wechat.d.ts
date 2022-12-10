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

export interface WechatMessageRequestBase {
  /**
   * @description 微信公众号的 AppId
   */
  ToUserName: string;
  /**
   * @description 微信用户的 openid
   */
  FromUserName: string;
  /**
   * @description 消息创建时间
   */
  CreateTime: number;
  /**
   * @description 消息类型
   */
  MsgType: string;
}

export interface WechatEventMessageRequest extends WechatMessageRequestBase {
  MsgType: 'event';
  /**
   * @description 事件类型
   */
  Event: string;
}

export interface WechatUserEnterTempsessionEventMessageRequest extends WechatEventMessageRequest {
  Event: 'user_enter_tempsession';
  /**
   * @description 会话来源
   */
  SessionFrom: string;
}

export interface WechatTemplateSubscribeMessageRequest extends WechatEventMessageRequest {
  Event: 'subscribe_msg_popup_event';
  List: ListItem | ListItem[];
}

export interface WechatTextMessageRequest extends WechatMessageRequestBase {
  MsgType: 'text';
  Content: string;
  MsgId: number;
}

export type WechatMessageRequest =
  | WechatUserEnterTempsessionEventMessageRequest
  | WechatTextMessageRequest
  | WechatTemplateSubscribeMessageRequest;

export type WechatMessageOriginalRequest = {
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

type TextMessage = {
  msgtype: 'text';
  text: {
    content: string;
  };
};

type ImageMessage = {
  msgtype: 'image';
  image: {
    media_id: string;
  };
};

type LinkMessage = {
  msgtype: 'link';
  link: {
    title: string;
    description: string;
    url: string;
    thumb_url: string;
  };
};

type MiniProgramMessage = {
  msgtype: 'miniprogrampage';
  miniprogrampage: {
    title: string;
    pagepath: string;
    thumb_media_id: string;
  };
};

type Message = TextMessage | ImageMessage | LinkMessage | MiniProgramMessage;

export type WechatMiniProgramSendCustomMessageRequest = {
  /**
   * @description 微信用户的 openid
   */
  touser: string;
} & Message;
