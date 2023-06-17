/* eslint-disable import/no-import-module-exports */
import '@/loadEnv';
import '@/metadata';
import { LoggerService } from '@/common/logger/logger.service';
import { rabbitmqServerConfig } from '@/configuration/rabbitmq.config';
import { Authorization } from '@/constants/constants';
import { createFastifyInstance } from '@/fastify/hook';
import { DateTimeFormat } from '@/utils/dayjs';
import { NestFactory } from '@nestjs/core';
import type { RmqOptions } from '@nestjs/microservices/interfaces/microservice-configuration.interface';
import type { NestFastifyApplication } from '@nestjs/platform-fastify';
import { FastifyAdapter } from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import type http from 'node:http';
import process from 'node:process';
import { AppModule } from './app.module';

require('source-map-support').install();

declare const module: any;

async function bootstrap(): Promise<void> {
  const logger = new LoggerService();
  logger.setContext('Bootstrap');

  // Nest
  const fastifyInstance = createFastifyInstance();
  const adapter = new FastifyAdapter(fastifyInstance);
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, adapter, {
    logger,
  });

  // RMQ
  app.connectMicroservice<RmqOptions>(rabbitmqServerConfig());

  // Start Microservice
  app
    .startAllMicroservices()
    .then(() => {
      logger.info(`Microservice started at ${DateTimeFormat()}`);
    })
    .catch((err) => {
      logger.error('Fail to startAllMicroservices!', err);
    });

  // CORS
  app.enableCors({
    origin: [
      'https://local.powerfulyang.com',
      'https://powerfulyang.github.io',
      'https://us4ever.com',
    ],
    credentials: true,
  });

  // prefix
  app.setGlobalPrefix('api');

  // Swagger
  const config = new DocumentBuilder()
    .setTitle('Backend API')
    .setDescription('The API is used for powerfulyang.com')
    .setVersion('1.0')
    .addCookieAuth(Authorization)
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/api/swagger', app, document);

  let peer: http.Server | undefined;
  // PeerServer
  import('peer').then(({ PeerServer }) => {
    PeerServer(
      {
        allow_discovery: true,
        port: 4000,
        path: '/peer',
      },
      (_) => {
        peer = _;
      },
    );
  });

  // Running Host and Port
  app.listen(process.env.PORT || 3000, '0.0.0.0').then(() => {
    logger.info(`Server is running on port ${process.env.PORT || 3000}`, 'Bootstrap');
  });

  // Hot Module Replacement
  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => {
      app.close();
      peer?.close();
    });
  }
}

(async (): Promise<void> => {
  await bootstrap();
})();
