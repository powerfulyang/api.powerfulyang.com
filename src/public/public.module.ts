import { Module } from '@nestjs/common';
import { AssetModule } from '@/asset/asset.module';
import { LoggerModule } from '@/common/logger/logger.module';
import { FeedModule } from '@/feed/feed.module';
import { RequestLogModule } from '@/request-log/request-log.module';
import { PostModule } from '@/post/post.module';
import { PublicController } from '@/public/public.controller';
import { RandomController } from '@/public/random.controller';

@Module({
  imports: [PostModule, AssetModule, FeedModule, LoggerModule, RequestLogModule],
  controllers: [PublicController, RandomController],
})
export class PublicModule {}
