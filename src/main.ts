import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { Logger, ValidationPipe } from '@nestjs/common';
import { CatchFilter } from '@/common/filter/catch.filter';
import { AppLogger } from '@/common/logger/app.logger';
import cookieParser from 'cookie-parser';
import { ResponseInterceptor } from '@/common/interceptor/response.interceptor';
import { __dev__ } from '@powerfulyang/utils';
import { AppModule } from './app.module';
import { RMQ_QUEUE, RMQ_URLS } from './constants/constants';

async function bootstrap(): Promise<void> {
    const app = await NestFactory.create(AppModule, {
        logger: __dev__ && new Logger(),
    });
    app.connectMicroservice({
        transport: Transport.RMQ,
        options: {
            urls: RMQ_URLS,
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
    app.use(cookieParser());
    app.useGlobalInterceptors(
        new ResponseInterceptor(new AppLogger()),
    );
    app.useGlobalPipes(new ValidationPipe());
    app.useGlobalFilters(new CatchFilter(new AppLogger()));
    await app.listen(3001);
}
(async (): Promise<void> => {
    await bootstrap();
})();
