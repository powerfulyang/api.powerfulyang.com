import { Module } from '@nestjs/common';
import { PostModule } from '@/modules/post/post.module';
import { PublicController } from '@/public/public.controller';
import { AssetModule } from '@/modules/asset/asset.module';
import { FeedModule } from '@/modules/feed/feed.module';

@Module({
  imports: [PostModule, AssetModule, FeedModule],
  controllers: [PublicController],
})
export class PublicModule {}
