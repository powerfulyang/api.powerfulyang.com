import { Module } from '@nestjs/common';
import { LoggerModule } from '@/common/logger/logger.module';
import { AmapService } from './amap.service';

@Module({
  imports: [LoggerModule],
  providers: [AmapService],
  exports: [AmapService],
})
export class AmapModule {}
