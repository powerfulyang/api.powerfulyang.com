import './loadEnv';
import { NestFactory } from '@nestjs/core';
import dayjs from 'dayjs';
import quarterOfYear from 'dayjs/plugin/quarterOfYear';
import { isDevProcess } from '@powerfulyang/utils';
import type { RmqOptions } from '@nestjs/microservices/interfaces/microservice-configuration.interface';
import { rabbitmqServerConfig } from '@/configuration/rabbitmq.config';
import { AppModule } from './app.module';
import { LoggerService } from '@/common/logger/logger.service';

dayjs.extend(quarterOfYear);

require('source-map-support').install();

async function bootstrap(): Promise<void> {
  const logger = new LoggerService();
  const app = await NestFactory.create(AppModule, {
    logger: isDevProcess && logger,
  });
  app.connectMicroservice<RmqOptions>(rabbitmqServerConfig());
  app.startAllMicroservices().then(() => {
    logger.info(`Microservice started at ${dayjs().format('YYYY-MM-DD HH:mm:ss')}`);
  });

  app.enableCors({
    origin: [
      'https://admin.powerfulyang.com',
      'https://powerfulyang.com',
      'https://local.powerfulyang.com',
    ],
    credentials: true,
  });

  app.setGlobalPrefix('api');

  app.listen(process.env.PORT || 3000).then(() => {
    logger.info(`Server is running on port ${process.env.PORT || 3000}`, 'Bootstrap');
  });
}

(async (): Promise<void> => {
  await bootstrap();
})();
