import { exec } from 'node:child_process';

if (process.env.BUILD === 'true') {
  exec('pnpm run download:traineddata', (error, stdout, stderr) => {
    if (error) {
      console.error(`An error occurred: ${error}`);
      return;
    }
    console.log(`stdout: ${stdout}`);
    console.error(`stderr: ${stderr}`);
  });
}
