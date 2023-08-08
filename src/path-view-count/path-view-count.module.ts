import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CacheModule } from '@/common/cache/cache.module';
import { LoggerModule } from '@/common/logger/logger.module';
import { OrmModule } from '@/service/typeorm/orm.module';
import { PathViewCount } from '@/path-view-count/entities/path-view-count.entity';
import { PathViewCountService } from '@/path-view-count/path-view-count.service';

@Module({
  imports: [OrmModule, TypeOrmModule.forFeature([PathViewCount]), CacheModule, LoggerModule],
  providers: [PathViewCountService],
  exports: [PathViewCountService],
})
export class PathViewCountModule {}
