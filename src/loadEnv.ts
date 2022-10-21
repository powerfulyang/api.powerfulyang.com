import dotenv from 'dotenv';
import { isProd, isQA, isTest } from '@/utils/env';
import dayjs from 'dayjs';
import quarterOfYear from 'dayjs/plugin/quarterOfYear';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';

dayjs.extend(quarterOfYear);
dayjs.extend(utc);
dayjs.extend(timezone);

if (isQA) {
  // must load the highest priority
  dotenv.config({ path: '.env.qa' });
}

if (isProd) {
  // must load the highest priority
  dotenv.config({ path: '.env.prod' });
}

if (isTest) {
  // config({ path: '.env.test' });
  dotenv.config({ path: '.env.prod' });
}
