import './loadEnv';
import { NestFactory } from '@nestjs/core';
import cookieParser from 'cookie-parser';
import dayjs from 'dayjs';
import quarterOfYear from 'dayjs/plugin/quarterOfYear';
import { isDevProcess } from '@powerfulyang/utils';
import { rabbitmqServerConfig } from '@/configuration/rabbitmq.config';
import { AppModule } from './app.module';
import { LoggerService } from '@/common/logger/logger.service';

dayjs.extend(quarterOfYear);

require('source-map-support').install();

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule, {
    logger: isDevProcess && new LoggerService(),
  });

  await app.startAllMicroservices();
  app.connectMicroservice(rabbitmqServerConfig());

  app.enableCors({
    origin: [
      'https://admin.powerfulyang.com',
      'https://powerfulyang.com',
      'https://local.powerfulyang.com',
    ],
    credentials: true,
  });

  app.setGlobalPrefix('api');

  app.use(cookieParser());

  await app.listen(process.env.PORT || 3000);
}

(async (): Promise<void> => {
  await bootstrap();
})();
