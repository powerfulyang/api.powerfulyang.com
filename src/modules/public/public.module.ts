import { LoggerModule } from '@/common/logger/logger.module';
import { AssetModule } from '@/modules/asset/asset.module';
import { FeedModule } from '@/modules/feed/feed.module';
import { PathViewCountModule } from '@/modules/path-view-count/path-view-count.module';
import { PostModule } from '@/modules/post/post.module';
import { PublicController } from '@/modules/public/public.controller';
import { RandomController } from '@/modules/public/random.controller';
import { ChatGptModule } from '@app/chat-gpt';
import { Module } from '@nestjs/common';

@Module({
  imports: [PostModule, AssetModule, FeedModule, LoggerModule, ChatGptModule, PathViewCountModule],
  controllers: [PublicController, RandomController],
})
export class PublicModule {}
