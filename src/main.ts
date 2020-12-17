import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { Logger, ValidationPipe } from '@nestjs/common';
import { AppLogger } from '@/common/logger/app.logger';
import cookieParser from 'cookie-parser';
import { __dev__ } from '@powerfulyang/utils';
import rateLimit from 'express-rate-limit';
import csrf from 'csurf';
import { HttpExceptionFilter } from '@/common/filter/http.exception.filter';
import { CatchFilter } from '@/common/filter/catch.filter';
import { AppModule } from './app.module';
import { RMQ_QUEUE, RMQ_URLS } from './constants/constants';

require('source-map-support').install();

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule, {
    logger: __dev__ && new Logger(),
  });
  app.connectMicroservice({
    transport: Transport.RMQ,
    options: {
      urls: RMQ_URLS(),
      queue: RMQ_QUEUE,
      queueOptions: {
        durable: false,
      },
      noAck: false,
      prefetchCount: 1,
    },
  });
  await app.startAllMicroservicesAsync();
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
  app.use(
    csrf({
      cookie: true,
      value(req) {
        return req.cookies._csrf_token;
      },
    }),
  );
  await app.listen(3001);
}

(async (): Promise<void> => {
  await bootstrap();
})();
