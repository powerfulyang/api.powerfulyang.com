import './loadEnv';
import { NestFactory } from '@nestjs/core';
import dayjs from 'dayjs';
import quarterOfYear from 'dayjs/plugin/quarterOfYear';
import type { RmqOptions } from '@nestjs/microservices/interfaces/microservice-configuration.interface';
import { PeerServer } from 'peer';
import { rabbitmqServerConfig } from '@/configuration/rabbitmq.config';
import { LoggerService } from '@/common/logger/logger.service';
import type { NestFastifyApplication } from '@nestjs/platform-fastify';
import { FastifyAdapter } from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import fastifyInstance from './fastify/hook';

dayjs.extend(quarterOfYear);

require('source-map-support').install();

async function bootstrap(): Promise<void> {
  const logger = new LoggerService();
  logger.setContext('Bootstrap');

  const adapter = new FastifyAdapter(fastifyInstance);
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, adapter, {
    logger,
  });

  // RMQ
  app.connectMicroservice<RmqOptions>(rabbitmqServerConfig());
  app
    .startAllMicroservices()
    .then(() => {
      logger.info(`Microservice started at ${dayjs().format('YYYY-MM-DD HH:mm:ss')}`);
    })
    .catch((err) => {
      logger.error('Fail to startAllMicroservices!', err);
    });

  // CORS
  app.enableCors({
    origin: [
      'https://admin.powerfulyang.com',
      'https://local.powerfulyang.com',
      'https://powerfulyang.com',
    ],
    credentials: true,
  });

  // prefix
  app.setGlobalPrefix('api');

  // Swagger
  const config = new DocumentBuilder()
    .setTitle('PowerfulYang API')
    .setDescription('PowerfulYang API')
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('doc', app, document);

  // PeerServer
  PeerServer({
    allow_discovery: true,
    port: 4000,
    path: '/peer',
  });

  // Running Host and Port
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
