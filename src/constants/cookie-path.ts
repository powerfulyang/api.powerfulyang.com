import { join } from 'path';

export const CWD = process.cwd();

export const COOKIE_PATH = join(CWD, '.cookies');

export const instagramCookieFilePath = join(COOKIE_PATH, 'instagram');

export const pixivCookieFilePath = join(COOKIE_PATH, 'pixiv');
