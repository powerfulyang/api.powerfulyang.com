import dotenv from 'dotenv';
import { __prod__ } from '@powerfulyang/utils';

// FIXME temporarily stop running
process.exit(0);

if (!__prod__) {
  // must load highest priority
  dotenv.config();
}
