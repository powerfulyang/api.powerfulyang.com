import { execSync } from 'node:child_process';

if (process.env.BUILD === 'true') {
  execSync('pnpm run download:traineddata', {
    stdio: 'inherit',
  });
  execSync('pnpm run swagger-helper', {
    stdio: 'inherit',
  });
}
