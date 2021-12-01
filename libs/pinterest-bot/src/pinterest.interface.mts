export interface PinterestResInterface {
  resource_response: ResourceResponse;
  client_context: ClientContext;
  resource: Resource;
  request_identifier: string;
}

export interface ClientContext {
  active_experiments: ActiveExperiments;
  app_version: string;
  browser_locale: string;
  browser_name: string;
  browser_type: number;
  browser_version: string;
  country: string;
  country_from_hostname: string;
  country_from_ip: string;
  csp_nonce: string;
  current_url: string;
  deep_link: string;
  enabled_advertiser_countries: string[];
  facebook_token: null;
  http_referrer: string;
  invite_code: string;
  invite_sender_id: string;
  is_amp: boolean;
  is_authenticated: boolean;
  is_bot: string;
  is_internal_ip: boolean;
  is_full_page: boolean;
  is_managed_advertiser: boolean;
  is_mobile_agent: boolean;
  is_shop_the_pin_campaign_whitelisted: boolean;
  is_sterling_on_steroids: boolean;
  is_tablet_agent: boolean;
  language: string;
  locale: string;
  origin: string;
  path: string;
  referrer: null;
  region_from_ip: string;
  request_host: string;
  social_bot: string;
  site_type: number;
  sterling_on_steroids_ldap: null;
  triggerable_experiments: { [key: string]: string };
  unauth_id: string;
  user_agent_can_use_native_app: boolean;
  no_fetch_context_on_resource: boolean;
  user_agent_platform: string;
  user_agent_platform_version: null;
  user_agent: string;
  user: User;
  utm_campaign: null;
  utm_medium: null;
  utm_source: null;
  utm_term: null;
  utm_pai: null;
  visible_url: URL;
  analysis_ua: AnalysisUa;
  request_identifier: string;
  root_request_identifier: null;
  parent_request_identifier: null;
  full_path: string;
  real_ip: string;
  placed_experiences: null;
  batch_exp: boolean;
  experiment_hash: string;
}

export interface ActiveExperiments {}

export interface AnalysisUa {
  app_type: number;
  browser_name: string;
  browser_version: string;
  device_type: null;
  device: string;
  os_name: string;
  os_version: string;
}

export interface User {
  id: string;
  full_name: string;
  connected_to_facebook: boolean;
  gplus_url: string;
  phone_number: null;
  type: UserType;
  verified_domains: any[];
  website_url: string;
  connected_to_microsoft: boolean;
  ip_country: string;
  image_small_url: string;
  verified_identity: ActiveExperiments;
  image_large_url: string;
  is_matured_new_user: boolean;
  has_quicksave_board: boolean;
  connected_to_youtube: boolean;
  third_party_marketing_tracking_enabled: boolean;
  domain_verified: boolean;
  allow_personalization_cookies: null;
  verified_user_websites: any[];
  ip_region: string;
  first_name: string;
  image_xlarge_url: string;
  epik: null;
  is_high_risk: boolean;
  unverified_phone_number: null;
  facebook_timeline_enabled: boolean;
  gender: string;
  is_write_banned: boolean;
  twitter_publish_enabled: boolean;
  image_medium_url: string;
  facebook_publish_stream_enabled: boolean;
  allow_marketing_cookies: null;
  can_enable_mfa: boolean;
  connected_to_dropbox: boolean;
  created_at: string;
  login_state: number;
  profile_discovered_public: boolean;
  allow_analytic_cookies: null;
  listed_website_url: string;
  twitter_url: null;
  unverified_phone_number_without_country: string;
  is_any_website_verified: boolean;
  custom_gender: null;
  phone_number_end: string;
  is_employee: boolean;
  is_partner: boolean;
  connected_to_google: boolean;
  resurrection_info: null;
  personalize_from_offsite_browsing: boolean;
  has_password: boolean;
  last_name: string;
  partner: Partner;
  has_mfa_enabled: boolean;
  unverified_phone_country: null;
  phone_country: null;
  email: string;
  nags: any[];
  push_package_user_id: string;
  age_in_years: null;
  country: string;
  username: string;
  domain_url: string;
  connected_to_instagram: boolean;
  facebook_id: string;
  connected_to_etsy: boolean;
}

export interface Partner {
  created_at: string;
  id: string;
  contact_name: string;
  selected_ecommerce_platforms: any[];
  type: string;
  business_name: string;
  advertising_intent: number;
  auto_follow_allowed: boolean;
  is_linked_business: boolean;
  is_convert: boolean;
  third_party_apps: any[];
  is_create: boolean;
  account_type: string;
  enable_profile_message: boolean;
  is_business_agency: null;
  business_goals: any[];
  enable_profile_address: boolean;
}

export enum UserType {
  User = 'user',
}

export enum URL {
  PowerfulyangBot = '/powerfulyang/bot/',
}

export interface Resource {
  name: string;
  options: Options;
}

export interface Options {
  bookmarks: string[];
  board_id: string;
  board_url: URL;
  currentFilter: number;
  field_set_key: string;
  filter_section_pins: boolean;
  sort: string;
  layout: string;
  page_size: number;
  redux_normalize_feed: boolean;
  no_fetch_context_on_resource: boolean;
}

export interface ResourceResponse {
  bookmark: string;
  code: number;
  data: Datum[];
  message: string;
  endpoint_name: string;
  status: string;
  x_pinterest_sli_endpoint_name: string;
  http_status: number;
}

export interface Datum {
  access: Access[];
  is_promotable: boolean;
  tracking_params: TrackingParams;
  repin_count: number;
  per_pin_analytics: PerPinAnalytics;
  rich_summary: RichSummary | null;
  embed: null;
  reaction_counts: ActiveExperiments;
  is_stale_product: boolean;
  board: Board;
  is_repin: boolean;
  category: string;
  alt_text: null;
  native_creator: Pinner | null;
  link: null | string;
  title: string;
  is_promoted: boolean;
  favorited_by_me: boolean;
  has_required_attribution_provider: boolean;
  description: Description;
  pinner: Pinner;
  image_signature: string;
  is_native: boolean;
  story_pin_data_id: null;
  is_oos_product: boolean;
  aggregated_pin_data: AggregatedPinData;
  type: DatumType;
  video_status_message: null;
  grid_title: string;
  is_quick_promotable: boolean;
  image_crop: ImageCrop;
  promoter: null;
  videos: null;
  is_eligible_for_pdp: boolean;
  creator_analytics: null;
  debug_info_html: null;
  dominant_color: string;
  images: { orig: Image };
  carousel_data: null;
  product_pin_data: null;
  favorite_user_count: number;
  id: string;
  sponsorship: null;
  is_downstream_promotion: boolean;
  domain: Domain;
  story_pin_data: null;
  promoted_is_removable: boolean;
  attribution: null;
  video_status: null;
  shopping_flags: any[];
}

export enum Access {
  Delete = 'delete',
  Write = 'write',
}

export interface AggregatedPinData {
  is_shop_the_look: boolean;
  id: string;
  aggregated_stats: AggregatedStats;
  has_xy_tags: boolean;
  creator_analytics: null;
}

export interface AggregatedStats {
  saves: number;
  done: number;
}

export interface Board {
  collaborated_by_me: boolean;
  followed_by_me: boolean;
  owner: PerPinAnalytics;
  type: BoardType;
  id: string;
  url: URL;
  privacy: Privacy;
  is_collaborative: boolean;
  name: Name;
}

export enum Name {
  Bot = 'bot',
}

export interface PerPinAnalytics {
  id: string;
}

export enum Privacy {
  Public = 'public',
}

export enum BoardType {
  Board = 'board',
}

export enum Description {
  Empty = ' ',
}

export enum Domain {
  TwitterCOM = 'twitter.com',
  UploadedByUser = 'Uploaded by user',
}

export interface ImageCrop {
  min_y: number;
  max_y: number;
}

export interface Image {
  width: number;
  height: number;
  url: string;
}

export interface Pinner {
  image_large_url: string;
  type: UserType;
  username: string;
  id: string;
  image_small_url: string;
  image_xlarge_url: string;
  last_name: string;
  full_name: string;
  image_medium_url: string;
  first_name: string;
}

export interface RichSummary {
  favicon_link: string;
  site_name: string;
  products: any[];
  type: string;
  display_description: string;
  url: string;
  apple_touch_icon_link: string;
  actions: any[];
  id: string;
  display_name: string;
  favicon_images: IconImages;
  apple_touch_icon_images: IconImages;
  type_name: string;
}

export interface IconImages {
  orig: string;
}

export enum TrackingParams {
  CwABAAAAEDk5NjYxMDk1NDg2MDc0MzUGAAMAAQA = 'CwABAAAAEDk5NjYxMDk1NDg2MDc0MzUGAAMAAQA',
}

export enum DatumType {
  Pin = 'pin',
}

export interface PinterestInterface {
  id: string;
  imgList: string[];
  tags: string[];
  originUrl: string;
}
