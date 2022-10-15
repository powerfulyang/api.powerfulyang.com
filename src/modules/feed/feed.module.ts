import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Feed } from '@/modules/feed/entities/feed.entity';
import { AssetModule } from '@/modules/asset/asset.module';
import { LoggerModule } from '@/common/logger/logger.module';
import { OrmModule } from '@/common/service/orm/orm.module';
import { FeedController } from './feed.controller';
import { FeedService } from './feed.service';

@Module({
  imports: [OrmModule, TypeOrmModule.forFeature([Feed]), AssetModule, LoggerModule],
  controllers: [FeedController],
  providers: [FeedService],
  exports: [FeedService],
})
export class FeedModule {}
