import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import type { INestApplication } from '@nestjs/common';
import { HttpStatus } from '@nestjs/common';
import request from 'supertest';
import { parse } from 'cookie';
import { AppModule } from '@/app.module';
import { UserService } from '@/modules/user/user.service';
import { Authorization } from '@/constants/constants';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let userService: UserService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    userService = moduleFixture.get<UserService>(UserService);
    await app.init();
  });

  it('/public/hello (GET)', () => {
    return request(app.getHttpServer())
      .get('/public/hello')
      .expect(HttpStatus.OK)
      .expect((r) => {
        expect(r.body.data).toContain('Hello,');
      });
  });

  it('/user/login (POST)', async () => {
    const user = await userService.getSaltByEmail('powerfulyang');
    return request(app.getHttpServer())
      .post('/user/login')
      .send({
        email: user.email,
        password: user.salt,
      })
      .expect(HttpStatus.CREATED)
      .expect(async (r) => {
        const { header } = r;
        const cookies = header['set-cookie'] as string[];
        const authorization = cookies
          .filter((cookie) => cookie.includes(Authorization))
          .find((cookie) => cookie);
        expect(authorization).toBeDefined();
        const parsed = parse(authorization!) as { [Authorization]: string };
        expect(parsed).toBeDefined();
        const verified = await userService.verifyAuthorization(parsed[Authorization]);
        expect(verified.id).toBe(user.id);
      });
  });
});
