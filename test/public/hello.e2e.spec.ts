import { afterAll, beforeAll, describe, expect, it } from '@jest/globals';
import { HttpStatus } from '@nestjs/common';
import type { NestFastifyApplication } from '@nestjs/platform-fastify';
import { initializeApp } from '@test/test-utils';

describe('public', () => {
  let app: NestFastifyApplication;

  beforeAll(async () => {
    app = await initializeApp();
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('hello (GET)', async () => {
    const result = await app.inject({
      method: 'GET',
      url: '/public/hello',
    });
    expect(result.statusCode).toBe(HttpStatus.OK);
    expect(result.body).toBe('Hello, unauthorized visitor!');
  });
});
