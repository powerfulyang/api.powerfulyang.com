export interface PixivBotApiQuery {
  tag: string;
  offset: number;
  limit: number;
  rest: 'show';
  lang: 'zh';
}
export interface RESPixivInterface {
  body: Body;
  error: boolean;
  message: string;
}

export interface Body {
  extraData: ExtraData;
  total: number;
  works: Work[];
  zoneConfig: ZoneConfig;
}

export interface ExtraData {
  meta: Meta;
}

export interface Meta {
  alternateLanguages: AlternateLanguages;
  canonical: string;
  description: string;
  descriptionHeader: string;
  ogp: Ogp;
  title: string;
  twitter: Ogp;
}

export interface AlternateLanguages {
  en: string;
  ja: string;
}

export interface Ogp {
  description: string;
  image: string;
  title: string;
  type?: string;
  card?: string;
}

export interface Work {
  alt: string;
  bookmarkData: BookmarkData;
  createDate: Date;
  description: string;
  height: number;
  id: string;
  illustId: string;
  illustTitle: string;
  illustType: number;
  isAdContainer: boolean;
  isBookmarkable: boolean;
  isUnlisted: boolean;
  pageCount: number;
  profileImageUrl: string;
  restrict: number;
  sl: number;
  tags: string[];
  title: string;
  titleCaptionTranslation: TitleCaptionTranslation;
  updateDate: Date;
  url: string;
  userId: string;
  userName: string;
  width: number;
  xRestrict: number;
}

export interface BookmarkData {
  id: string;
  private: boolean;
}

export interface TitleCaptionTranslation {
  workCaption: null;
  workTitle: null;
}

export interface ZoneConfig {
  '500x500': The500_X500;
  footer: The500_X500;
  header: The500_X500;
  logo: The500_X500;
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export interface The500_X500 {
  url: string;
}
