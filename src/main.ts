/*
 eslint-disable import/no-import-module-exports
*/
import 'reflect-metadata';
import './loadEnv';
import { NestFactory } from '@nestjs/core';
import dayjs from 'dayjs';
import quarterOfYear from 'dayjs/plugin/quarterOfYear';
import type { RmqOptions } from '@nestjs/microservices/interfaces/microservice-configuration.interface';
import { ExpressPeerServer } from 'peer';
import { rabbitmqServerConfig } from '@/configuration/rabbitmq.config';
import { LoggerService } from '@/common/logger/logger.service';
import { AppModule } from './app.module';

dayjs.extend(quarterOfYear);

require('source-map-support').install();

declare const module: any;

async function bootstrap(): Promise<void> {
  const logger = new LoggerService();
  logger.setContext('Bootstrap');
  const app = await NestFactory.create(AppModule, {
    logger,
  });
  app.connectMicroservice<RmqOptions>(rabbitmqServerConfig());
  app.startAllMicroservices().then(() => {
    logger.info(`Microservice started at ${dayjs().format('YYYY-MM-DD HH:mm:ss')}`);
  });

  app.enableCors({
    origin: ['https://admin.powerfulyang.com', 'https://local.powerfulyang.com'],
    credentials: true,
  });

  app.setGlobalPrefix('api');

  const peerServer = ExpressPeerServer(app.getHttpServer(), {
    allow_discovery: true,
  });

  app.use('/api/peerjs', peerServer);

  app.listen(process.env.PORT || 3000).then(() => {
    logger.info(`Server is running on port ${process.env.PORT || 3000}`, 'Bootstrap');
  });

  if (module.hot) {
    module.hot.accept();
    module.hot.dispose(() => app.close());
  }
}

(async (): Promise<void> => {
  await bootstrap();
})();
