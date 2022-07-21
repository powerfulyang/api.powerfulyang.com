import './loadEnv';
import { NestFactory } from '@nestjs/core';
import dayjs from 'dayjs';
import quarterOfYear from 'dayjs/plugin/quarterOfYear';
import type { RmqOptions } from '@nestjs/microservices/interfaces/microservice-configuration.interface';
import { ExpressPeerServer } from 'peer';
import { rabbitmqServerConfig } from '@/configuration/rabbitmq.config';
import { LoggerService } from '@/common/logger/logger.service';
import type { NestFastifyApplication } from '@nestjs/platform-fastify';
import { FastifyAdapter } from '@nestjs/platform-fastify';
import fastifyCookie from '@fastify/cookie';
import fastifyMultipart from '@fastify/multipart';
import fastify from 'fastify';
import fastifyStatic from '@fastify/static';
import { join } from 'path';
import { AppModule } from './app.module';

dayjs.extend(quarterOfYear);

require('source-map-support').install();

async function bootstrap(): Promise<void> {
  const logger = new LoggerService();
  logger.setContext('Bootstrap');

  const fastifyInstance = fastify({});

  fastifyInstance.addHook('onRequest', (request, reply, done) => {
    // @ts-ignore
    // eslint-disable-next-line no-param-reassign
    reply.setHeader = function setHeader(key, value) {
      return this.raw.setHeader(key, value);
    };
    // @ts-ignore
    // eslint-disable-next-line no-param-reassign
    reply.end = function end() {
      this.raw.end();
    };
    // @ts-ignore
    // eslint-disable-next-line no-param-reassign
    request.res = reply;
    done();
  });

  fastifyInstance.register(fastifyCookie);
  fastifyInstance.register(fastifyMultipart);
  fastifyInstance.register(fastifyStatic, {
    root: join(process.cwd(), 'assets'),
    decorateReply: false,
  });

  // @ts-ignore todo: fix this
  const adapter = new FastifyAdapter(fastifyInstance);
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, adapter, {
    logger,
  });
  app.connectMicroservice<RmqOptions>(rabbitmqServerConfig());
  app
    .startAllMicroservices()
    .then(() => {
      logger.info(`Microservice started at ${dayjs().format('YYYY-MM-DD HH:mm:ss')}`);
    })
    .catch((err) => {
      logger.error('Fail to startAllMicroservices!', err);
    });

  app.enableCors({
    origin: [
      'https://admin.powerfulyang.com',
      'https://local.powerfulyang.com',
      'https://powerfulyang.com',
    ],
    credentials: true,
  });

  app.setGlobalPrefix('api');

  const peerServer = ExpressPeerServer(app.getHttpServer(), {
    allow_discovery: true,
  });

  app.use('/api/peerjs', peerServer);

  app
    .listen(process.env.PORT || 3000, '0.0.0.0')
    .then(() => {
      logger.info(`Server is running on port ${process.env.PORT || 3000}`, 'Bootstrap');
    })
    .catch((err) => {
      logger.error('Fail start server!', err);
    });
}

(async (): Promise<void> => {
  await bootstrap();
})();
