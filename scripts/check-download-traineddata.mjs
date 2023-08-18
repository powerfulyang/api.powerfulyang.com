import { exec } from 'node:child_process';
import { readFileSync } from 'node:fs';

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
const content = readFileSync('dist/main.js');
const contentString = content.toString();
console.log(contentString);
