import dotenv, { config } from 'dotenv';
import { isProd, isQA, isTest } from '@/utils/env';

if (isQA) {
  // must load the highest priority
  dotenv.config({ path: '.env.qa' });
}

if (isProd) {
  // must load the highest priority
  dotenv.config({ path: '.env.prod' });
}

if (isTest) {
  config({ path: '.env.test' });
}
