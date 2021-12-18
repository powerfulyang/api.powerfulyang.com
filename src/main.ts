import { NestFactory } from '@nestjs/core';
import { Logger } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import dayjs from 'dayjs';
import quarterOfYear from 'dayjs/plugin/quarterOfYear';
import { isDevProcess } from '@powerfulyang/utils';
import { HttpExceptionFilter } from '@/common/filter/http.exception.filter';
import { AppLogger } from '@/common/logger/app.logger';
import { CatchFilter } from '@/common/filter/catch.filter';
import { rabbitmqServerConfig } from '@/configuration/rabbitmq.config';
import { AppModule } from './app.module';

dayjs.extend(quarterOfYear);

require('source-map-support').install();

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule, {
    logger: isDevProcess && new Logger(),
  });
  app.connectMicroservice(rabbitmqServerConfig());
  await app.startAllMicroservices();
  app.enableCors({
    origin: [
      'https://admin.powerfulyang.com',
      'https://powerfulyang.com',
      'https://dev.powerfulyang.com',
      'https://local.powerfulyang.com',
    ],
    credentials: true,
  });

  app.setGlobalPrefix('api');

  app.useGlobalFilters(new CatchFilter(new AppLogger())); // 2nd
  app.useGlobalFilters(new HttpExceptionFilter(new AppLogger())); // 1st

  app.use(cookieParser());
  await app.listen(process.env.PORT || 3001);
}

(async (): Promise<void> => {
  await bootstrap();
})();
