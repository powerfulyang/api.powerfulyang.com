import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { config } from 'dotenv';
import { CustomLogger } from './common/logger/CustomLogger';

if (process.env.NODE_ENV !== 'production') {
    config();
}

async function bootstrap(): Promise<void> {
    const app = await NestFactory.create(AppModule, { logger: new CustomLogger() });
    app.enableCors();
    await app.listen(3001);
}
(async (): Promise<void> => {
    await bootstrap();
})();
