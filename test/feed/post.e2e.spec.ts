import { TEST_ASSETS_IMAGES } from '@/constants/test_constants';
import { UserService } from '@/user/user.service';
import { afterAll, beforeAll, describe, expect, it } from '@jest/globals';
import { HttpStatus } from '@nestjs/common';
import type { NestFastifyApplication } from '@nestjs/platform-fastify';
import { initializeApp } from '@test/test-utils';
import FormData from 'form-data';
import { createReadStream } from 'node:fs';
import { join } from 'node:path';

describe('feed', () => {
  let app: NestFastifyApplication;
  let userService: UserService;
  const testAssetsFeedImage = join(TEST_ASSETS_IMAGES, 'multi.png');

  beforeAll(async () => {
    app = await initializeApp();
    await app.init();
    userService = app.get<UserService>(UserService);
    await userService.cacheUsers();
  });

  afterAll(async () => {
    await app.close();
  });

  it('non-admin post feed (POST)', async () => {
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
    hasAttachmentFormData.append('assets', createReadStream(testAssetsFeedImage));
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

  it('admin post feed (POST)', async () => {
    const user = await userService.getUserByEmailOrFail('powerfulyang');
    const authorization = await userService.generateAuthorization(user);
    const formData = new FormData();
    formData.append('content', 'test-public-publish');
    formData.append('public', 'true');
    formData.append('assets', createReadStream(testAssetsFeedImage));
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
