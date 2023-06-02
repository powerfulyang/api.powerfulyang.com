import { join } from 'path';

export const CWD = process.cwd();

export const instagramCookieFilePath = join(CWD, '.cookies', 'instagram');
