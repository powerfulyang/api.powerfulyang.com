import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport } from '@nestjs/microservices';
import { RMQ_QUEUE, RMQ_URLS } from './constants/constants';

async function bootstrap(): Promise<void> {
    const app = await NestFactory.create(AppModule);
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
    app.enableCors();
    await app.listen(3001);
}
(async (): Promise<void> => {
    await bootstrap();
})();
