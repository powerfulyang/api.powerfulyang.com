import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PathViewCount } from '@/modules/path-view-count/entities/path-view-count.entity';
import { PathViewCountService } from '@/modules/path-view-count/path-view-count.service';
import { OrmModule } from '@/common/service/ORM/orm.module';
import { LoggerModule } from '@/common/logger/logger.module';
import { CacheModule } from '@/common/cache/cache.module';

@Module({
  imports: [OrmModule, TypeOrmModule.forFeature([PathViewCount]), CacheModule, LoggerModule],
  providers: [PathViewCountService],
  exports: [PathViewCountService],
})
export class PathViewCountModule {}
