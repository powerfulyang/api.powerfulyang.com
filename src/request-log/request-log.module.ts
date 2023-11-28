import { RequestLog } from '@/request-log/entities/request-log.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CacheModule } from '@/common/cache/cache.module';
import { LoggerModule } from '@/common/logger/logger.module';
import { OrmModule } from '@/service/typeorm/orm.module';
import { RequestLogService } from '@/request-log/request-log.service';

@Module({
  imports: [OrmModule, TypeOrmModule.forFeature([RequestLog]), CacheModule, LoggerModule],
  providers: [RequestLogService],
  exports: [RequestLogService],
})
export class RequestLogModule {}
