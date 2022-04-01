import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PathViewCount } from '@/modules/path-ip-view-count/entities/path-view-count.entity';
import { PathViewCountService } from '@/modules/path-ip-view-count/path-view-count.service';
import { OrmModule } from '@/common/ORM/orm.module';
import { LoggerModule } from '@/common/logger/logger.module';
import { CacheModule } from '@/common/cache/cache.module';

@Global()
@Module({
  imports: [OrmModule, TypeOrmModule.forFeature([PathViewCount]), CacheModule, LoggerModule],
  providers: [PathViewCountService],
  exports: [PathViewCountService],
})
export class PathViewCountModule {}
