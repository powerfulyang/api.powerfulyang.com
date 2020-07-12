import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport } from '@nestjs/microservices';
import { RMQ_QUEUE, RMQ_URLS } from './constants/constants';

if (process.env.NODE_ENV !== 'production') {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    require('dotenv').config();
}

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
        },
    });
    await app.startAllMicroservicesAsync();
    app.enableCors();
    await app.listen(3001);
}
(async (): Promise<void> => {
    await bootstrap();
})();
