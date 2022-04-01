import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import type { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '@/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/public/hello (GET)', () => {
    return request(app.getHttpServer())
      .get('/public/hello')
      .expect(200)
      .expect((r) => {
        expect(r.body.data).toBe('Hello World!!!');
      });
  });
});
