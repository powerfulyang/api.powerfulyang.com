import dotenv from 'dotenv';
import { __prod__ } from '@powerfulyang/utils';

if (!__prod__) {
  // must load highest priority
  dotenv.config();
}
