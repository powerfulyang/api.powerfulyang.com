import type { Cookie } from '@/common/interceptor/cookie.interceptor';
import { Authorization } from '@/constants/constants';
import { UserService } from '@/user/user.service';
import { afterAll, beforeAll, describe, expect, it } from '@jest/globals';
import { HttpStatus } from '@nestjs/common';
import type { NestFastifyApplication } from '@nestjs/platform-fastify';
import { initializeApp } from '@test/test-utils';

describe('user login', () => {
  let app: NestFastifyApplication;
  let userService: UserService;

  beforeAll(async () => {
    app = await initializeApp();
    await app.init();
    userService = app.get<UserService>(UserService);
    await userService.cacheUsers();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/user/login (POST)', async () => {
    const user = await userService.getSaltByEmail('powerfulyang');
    return app
      .inject({
        method: 'POST',
        url: '/user/login',
        payload: {
          email: user.email,
          password: user.salt,
        },
      })
      .then(async (res) => {
        expect(res.statusCode).toBe(HttpStatus.CREATED);
        const cookies = res.cookies as Pick<Cookie, 'name' | 'value'>[];
        const authorization = cookies
          .filter((cookie) => cookie.name === Authorization)
          .find((cookie) => cookie) || { value: '' };
        const verified = await userService.verifyAuthorization(authorization.value);
        expect(verified.id).toBe(user.id);
        return authorization.value;
      })
      .then(async (authorization) => {
        // publish public post
        const res = await app.inject({
          method: 'POST',
          url: '/post',
          headers: {
            authorization,
          },
          payload: {
            title: 'test-public-publish',
            content: 'test-public-publish',
          },
        });
        expect(res.statusCode).toBe(HttpStatus.CREATED);
        const json = res.json();
        expect(json).toHaveProperty(['title'], 'test-public-publish');
        const id = json.id as string;
        const res_1 = await app.inject({
          method: 'DELETE',
          url: `/post/${id}`,
          headers: {
            authorization,
          },
        });
        expect(res_1.statusCode).toBe(HttpStatus.NO_CONTENT);
      });
  });
});
