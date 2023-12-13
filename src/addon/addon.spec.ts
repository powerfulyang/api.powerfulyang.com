import { hello } from '@/addon/index';
import { describe, expect, it } from '@jest/globals';

describe('Addon', () => {
  it('hello', () => {
    const msg = hello('World');
    expect(msg).toBe('Hello World!');
  });
});
