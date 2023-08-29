import { AppModule } from '@/app.module';
import { createFastifyInstance } from '@/fastify/hook';
import type { NestFastifyApplication } from '@nestjs/platform-fastify';
import { FastifyAdapter } from '@nestjs/platform-fastify';
import type { TestingModule } from '@nestjs/testing';
// eslint-disable-next-line import/no-extraneous-dependencies
import { Test } from '@nestjs/testing';

export const initializeApp = async (): Promise<NestFastifyApplication> => {
  const moduleFixture: TestingModule = await Test.createTestingModule({
    imports: [AppModule],
  }).compile();

  const fastifyInstance = createFastifyInstance();
  return moduleFixture.createNestApplication<NestFastifyApplication>(
    new FastifyAdapter(fastifyInstance),
  );
};
