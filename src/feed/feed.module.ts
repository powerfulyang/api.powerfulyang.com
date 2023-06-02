import { LoggerModule } from '@/common/logger/logger.module';
import { AlgoliaService } from '@/common/service/algolia/AlgoliaService';
import { OrmModule } from '@/common/service/orm/orm.module';
import { AssetModule } from '@/asset/asset.module';
import { Feed } from '@/feed/entities/feed.entity';
import { FeedManageController } from '@/feed/feed-manage.controller';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FeedController } from './feed.controller';
import { FeedService } from './feed.service';

@Module({
  imports: [OrmModule, TypeOrmModule.forFeature([Feed]), AssetModule, LoggerModule],
  controllers: [FeedController, FeedManageController],
  providers: [FeedService, AlgoliaService],
  exports: [FeedService],
})
export class FeedModule {}
