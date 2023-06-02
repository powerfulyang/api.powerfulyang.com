import { LoggerModule } from '@/common/logger/logger.module';
import { AssetModule } from '@/asset/asset.module';
import { FeedModule } from '@/feed/feed.module';
import { PathViewCountModule } from '@/path-view-count/path-view-count.module';
import { PostModule } from '@/post/post.module';
import { PublicController } from '@/public/public.controller';
import { RandomController } from '@/public/random.controller';
import { ChatGptModule } from '@app/chat-gpt';
import { Module } from '@nestjs/common';

@Module({
  imports: [PostModule, AssetModule, FeedModule, LoggerModule, ChatGptModule, PathViewCountModule],
  controllers: [PublicController, RandomController],
})
export class PublicModule {}
