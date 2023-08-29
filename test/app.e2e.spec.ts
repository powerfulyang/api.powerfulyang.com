import { UserService } from '@/user/user.service';
import { afterAll, beforeAll, describe, expect, it } from '@jest/globals';
import { HttpStatus } from '@nestjs/common';
import type { NestFastifyApplication } from '@nestjs/platform-fastify';
import { initializeApp } from '@test/test-utils';

describe('AppController (e2e)', () => {
  let app: NestFastifyApplication;
  let userService: UserService;

  beforeAll(async () => {
    app = await initializeApp();

    userService = app.get<UserService>(UserService);

    await app.init();
    await userService.cacheUsers();
  });

  afterAll(async () => {
    await app.close();
  });

  it('test user should only create non-public post', async () => {
    const user = await userService.getUserByEmailOrFail('test user');
    const authorization = await userService.generateAuthorization(user);
    const publicPostRes = await app.inject({
      method: 'POST',
      url: '/post',
      headers: {
        authorization,
      },
      payload: {
        title: 'test-public-publish',
        content: 'test-public-publish',
        public: true,
      },
    });
    expect(publicPostRes.statusCode).toBe(HttpStatus.FORBIDDEN);
    const nonPublicPostRes = await app.inject({
      method: 'POST',
      url: '/post',
      headers: {
        authorization,
      },
      payload: {
        title: 'test-non-public-publish',
        content: 'test-none-public-publish',
      },
    });
    expect(nonPublicPostRes.statusCode).toBe(HttpStatus.CREATED);
    const json = nonPublicPostRes.json();
    expect(json).toHaveProperty(['title'], 'test-non-public-publish');
    const id = json.id as string;
    const deleteRes = await app.inject({
      method: 'DELETE',
      url: `/post/${id}`,
      headers: {
        authorization,
      },
    });
    expect(deleteRes.statusCode).toBe(HttpStatus.NO_CONTENT);
  });
});
