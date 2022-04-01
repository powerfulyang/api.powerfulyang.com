import dotenv from 'dotenv';
import { isDevProcess } from '@powerfulyang/utils';

if (isDevProcess) {
  // must load the highest priority
  dotenv.config({ path: '.env.local' });
}
