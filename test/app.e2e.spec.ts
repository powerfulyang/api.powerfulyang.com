import { afterAll, beforeAll, describe, expect, it } from '@jest/globals';
import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import { HttpStatus } from '@nestjs/common';
import { AppModule } from '@/app.module';
import { UserService } from '@/modules/user/user.service';
import type { NestFastifyApplication } from '@nestjs/platform-fastify';
import { FastifyAdapter } from '@nestjs/platform-fastify';
import { Authorization } from '@/constants/constants';
import type { Cookie } from '@/common/interceptor/cookie.interceptor';
import fastifyInstance from '@/fastify/hook';
import { threadPool } from '@powerfulyang/node-utils';
import FormData from 'form-data';
import { join } from 'node:path';
import { createReadStream } from 'node:fs';

describe('AppController (e2e)', () => {
  let app: NestFastifyApplication;
  let userService: UserService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication<NestFastifyApplication>(
      new FastifyAdapter(fastifyInstance),
    );

    userService = moduleFixture.get<UserService>(UserService);

    await app.init();
    await userService.cacheUsers();
  });

  afterAll(async () => {
    await app.close();
    await threadPool.destroy();
  });

  it('/public/hello (GET)', () => {
    return app
      .inject({
        method: 'GET',
        url: '/public/hello',
      })
      .then((res) => {
        expect(res.statusCode).toBe(HttpStatus.OK);
        expect(res.body).toBe('Hello, unauthorized visitor!');
      });
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
      .then((authorization) => {
        // publish public post
        return app
          .inject({
            method: 'POST',
            url: '/post',
            headers: {
              authorization,
            },
            payload: {
              title: 'test-public-publish',
              content: 'test-public-publish',
            },
          })
          .then((res) => {
            expect(res.statusCode).toBe(HttpStatus.CREATED);
            const json = res.json();
            expect(json).toHaveProperty(['title'], 'test-public-publish');
            return json.id as string;
          })
          .then((id) => {
            // delete
            return app
              .inject({
                method: 'DELETE',
                url: `/post/${id}`,
                headers: {
                  authorization,
                },
              })
              .then((res) => {
                expect(res.statusCode).toBe(HttpStatus.NO_CONTENT);
              });
          });
      });
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

  it('test user should only create non-public feed', async () => {
    const user = await userService.getUserByEmailOrFail('test user');
    const authorization = await userService.generateAuthorization(user);
    const formData = new FormData();
    formData.append('content', 'test-public-publish');
    formData.append('public', 'true');
    const publishPublicFeedRes = await app.inject({
      method: 'POST',
      url: '/feed',
      headers: {
        authorization,
        ...formData.getHeaders(),
      },
      payload: formData,
    });
    expect(publishPublicFeedRes.statusCode).toBe(HttpStatus.FORBIDDEN);
    const hasAttachmentFormData = new FormData();
    hasAttachmentFormData.append('content', 'test-non-public-publish');
    const testImagePath = join(process.cwd(), 'assets', 'test.jpg');
    hasAttachmentFormData.append('assets', createReadStream(testImagePath));
    const hasAttachmentRes = await app.inject({
      method: 'POST',
      url: '/feed',
      headers: {
        authorization,
        ...hasAttachmentFormData.getHeaders(),
      },
      payload: hasAttachmentFormData,
    });
    expect(hasAttachmentRes.statusCode).toBe(HttpStatus.FORBIDDEN);
    const formData2 = new FormData();
    formData2.append('content', 'test-non-public-publish');
    const nonPublicPostRes = await app.inject({
      method: 'POST',
      url: '/feed',
      headers: {
        authorization,
        ...formData2.getHeaders(),
      },
      payload: formData2,
    });
    expect(nonPublicPostRes.statusCode).toBe(HttpStatus.CREATED);
    const json = nonPublicPostRes.json();
    expect(json).toHaveProperty(['content'], 'test-non-public-publish');
    const id = json.id as string;
    const deleteRes = await app.inject({
      method: 'DELETE',
      url: `/feed/${id}`,
      headers: {
        authorization,
      },
    });
    expect(deleteRes.statusCode).toBe(HttpStatus.NO_CONTENT);
  });

  it('admin user should be able to create public content', async () => {
    const user = await userService.getUserByEmailOrFail('powerfulyang');
    const authorization = await userService.generateAuthorization(user);
    const formData = new FormData();
    formData.append('content', 'test-public-publish');
    formData.append('public', 'true');
    const testImagePath = join(process.cwd(), 'assets', 'test.jpg');
    formData.append('assets', createReadStream(testImagePath));
    const publishPublicFeedRes = await app.inject({
      method: 'POST',
      url: '/feed',
      headers: {
        authorization,
        ...formData.getHeaders(),
      },
      payload: formData,
    });
    expect(publishPublicFeedRes.statusCode).toBe(HttpStatus.CREATED);
    // delete
    const json = publishPublicFeedRes.json();
    const id = json.id as string;
    const deleteRes = await app.inject({
      method: 'DELETE',
      url: `/feed/${id}`,
      headers: {
        authorization,
      },
    });
    expect(deleteRes.statusCode).toBe(HttpStatus.NO_CONTENT);
  });
});
