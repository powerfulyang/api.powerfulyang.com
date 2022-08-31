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
    await app.getHttpAdapter().getInstance().ready();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/public/hello (GET)', () => {
    return app
      .inject({
        method: 'GET',
        url: '/public/hello',
      })
      .then((res) => {
        expect(res.statusCode).toBe(HttpStatus.OK);
        expect(res.json()).toHaveProperty('data', 'Hello, unauthorized visitor!');
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
      });
  });
});
