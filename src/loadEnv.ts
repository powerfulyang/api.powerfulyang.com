import dotenv from 'dotenv';
import { isProdProcess } from '@powerfulyang/utils';

if (!isProdProcess) {
  // must load highest priority
  dotenv.config();
}
