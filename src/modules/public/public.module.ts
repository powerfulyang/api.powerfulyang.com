import { Module } from '@nestjs/common';
import { PostModule } from '@/modules/post/post.module';
import { PublicController } from '@/modules/public/public.controller';
import { AssetModule } from '@/modules/asset/asset.module';
import { FeedModule } from '@/modules/feed/feed.module';
import { LoggerModule } from '@/common/logger/logger.module';

@Module({
  imports: [PostModule, AssetModule, FeedModule, LoggerModule],
  controllers: [PublicController],
})
export class PublicModule {}
