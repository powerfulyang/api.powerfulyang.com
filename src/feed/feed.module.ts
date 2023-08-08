import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerModule } from '@/common/logger/logger.module';
import { AlgoliaService } from '@/service/algolia/AlgoliaService';
import { OrmModule } from '@/service/typeorm/orm.module';
import { AssetModule } from '@/asset/asset.module';
import { Feed } from '@/feed/entities/feed.entity';
import { FeedManageController } from '@/feed/feed-manage.controller';
import { FeedController } from './feed.controller';
import { FeedService } from './feed.service';

@Module({
  imports: [OrmModule, TypeOrmModule.forFeature([Feed]), AssetModule, LoggerModule],
  controllers: [FeedController, FeedManageController],
  providers: [FeedService, AlgoliaService],
  exports: [FeedService],
})
export class FeedModule {}
