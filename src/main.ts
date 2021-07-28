import { NestFactory } from '@nestjs/core';
import { Logger, ValidationPipe } from '@nestjs/common';
import { AppLogger } from '@/common/logger/app.logger';
import cookieParser from 'cookie-parser';
import { __dev__ } from '@powerfulyang/utils';
import rateLimit from 'express-rate-limit';
import { HttpExceptionFilter } from '@/common/filter/http.exception.filter';
import { CatchFilter } from '@/common/filter/catch.filter';
import { rabbitmqServerConfig } from '@/configuration/rabbitmq.config';
import { AppModule } from './app.module';

require('source-map-support').install();

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule, {
    logger: __dev__ && new Logger(),
  });
  app.connectMicroservice(rabbitmqServerConfig());
  await app.startAllMicroservices();
  app.enableCors({
    origin: 'https://admin.powerfulyang.com',
    credentials: true,
  });

  app.setGlobalPrefix('api');

  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new CatchFilter(new AppLogger())); // 2nd
  app.useGlobalFilters(new HttpExceptionFilter(new AppLogger())); // 1st

  app.use(
    rateLimit({
      windowMs: 5 * 60 * 1000, // 15 minutes
      max: 100, // limit each IP to 100 requests per windowMs
    }),
  );
  app.use(cookieParser());
  await app.listen(process.env.PORT || 3001);
}

(async (): Promise<void> => {
  await bootstrap();
})();
