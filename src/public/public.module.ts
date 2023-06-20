import { AssetModule } from '@/asset/asset.module';
import { LoggerModule } from '@/common/logger/logger.module';
import { FeedModule } from '@/feed/feed.module';
import { PathViewCountModule } from '@/path-view-count/path-view-count.module';
import { PostModule } from '@/post/post.module';
import { PublicController } from '@/public/public.controller';
import { RandomController } from '@/public/random.controller';
import { Module } from '@nestjs/common';

@Module({
  imports: [PostModule, AssetModule, FeedModule, LoggerModule, PathViewCountModule],
  controllers: [PublicController, RandomController],
})
export class PublicModule {}
