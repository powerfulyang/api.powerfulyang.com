import { isProd, isQA, isTest } from '@/utils/env';
import dayjs from 'dayjs';
import quarterOfYear from 'dayjs/plugin/quarterOfYear';
import dotenv from 'dotenv';

dayjs.extend(quarterOfYear);

if (isQA) {
  // must load the highest priority
  dotenv.config({ path: '.env.qa' });
}

if (isProd) {
  // must load the highest priority
  dotenv.config({ path: '.env.prod' });
}

if (isTest) {
  // must load the highest priority
  dotenv.config({ path: '.env.test' });
}
