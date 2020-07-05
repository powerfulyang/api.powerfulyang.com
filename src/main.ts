import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
    const app = await NestFactory.create(AppModule);
    app.enableCors();
    // app.useGlobalInterceptors(new ResponseFormatInterceptor());
    await app.listen(3001);
}
(async (): Promise<void> => {
    await bootstrap();
})();
