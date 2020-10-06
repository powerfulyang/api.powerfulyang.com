import { Global, Module } from '@nestjs/common';
import { AppLogger } from '@/common/logger/app.logger';

@Global()
@Module({
    providers: [AppLogger],
    exports: [AppLogger],
})
export class LoggerModule {}
