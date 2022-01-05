import dotenv from 'dotenv';
import { isProdProcess } from '@powerfulyang/utils';

if (!isProdProcess) {
  // must load the highest priority
  dotenv.config();
}
