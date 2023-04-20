import { convertUuidToNumber } from '@/utils/uuid';
import { afterAll, describe, expect, it } from '@jest/globals';
import { sha1, threadPool } from '@powerfulyang/node-utils';
import { basename, extname } from 'node:path';

describe('utils test', () => {
  afterAll(() => {
    threadPool.destroy();
  });

  it('sha1', () => {
    expect(sha1('我是机器人')).toBe('425a666053295fecbdd5815872ccb9a6196b5df2');
  });

  it('extname', () => {
    const filename = '/a/b/c/d.test.jpg';
    const ext = extname(filename);
    const base = basename(filename, ext);
    expect(ext).toBe('.jpg');
    expect(base).toBe('d.test');
  });

  it('uuid', () => {
    const result = convertUuidToNumber();
    const mod = result % 10000;
    expect(mod).toBeLessThan(10000);
  });
});
