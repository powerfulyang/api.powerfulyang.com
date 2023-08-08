import { basename, extname } from 'node:path';
import { describe, expect, it } from '@jest/globals';
import { convertUuidToNumber } from '@/utils/uuid';

describe('utils test', () => {
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
