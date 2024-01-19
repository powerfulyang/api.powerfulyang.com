import '@/loadEnv';
import { patchNestJsSwagger } from 'nestjs-zod';
import process from 'node:process';
import { NestFactory } from '@nestjs/core';
import type { RmqOptions } from '@nestjs/microservices/interfaces/microservice-configuration.interface';
import type { NestFastifyApplication } from '@nestjs/platform-fastify';
import { FastifyAdapter } from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import metadata from '@/metadata';
import { LoggerService } from '@/common/logger/logger.service';
import { rabbitmqServerConfig } from '@/configuration/rabbitmq.config';
import { Authorization } from '@/constants/constants';
import { createFastifyInstance } from '@/fastify/hook';
import { DateTimeFormat } from '@/utils/dayjs';
import { AppModule } from './app.module';

require('source-map-support').install();

patchNestJsSwagger();

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
      'https://powerfulyang.com',
      'https://littleeleven.com',
      'https://admin.powerfulyang.com',
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
  if (!process.env.IGNORE_METADATA) {
    // @ts-ignore
    await SwaggerModule.loadPluginMetadata(metadata);
  }
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/api/swagger', app, document);

  // PeerServer
  import('peer').then(({ PeerServer }) => {
    PeerServer({
      allow_discovery: true,
      port: 4000,
      path: '/peer',
    });
  });

  const PORT = process.env.PORT || 3000;
  // Running Host and Port
  app.listen(PORT, '0.0.0.0').then(() => {
    logger.info(`Server is running on port ${PORT}`, 'Bootstrap');
  });
}

(async (): Promise<void> => {
  await bootstrap();
})();
