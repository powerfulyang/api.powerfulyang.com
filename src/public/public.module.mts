import { Module } from '@nestjs/common';
import { PostModule } from '@/modules/post/post.module.mjs';
import { PublicService } from '@/public/public.service.mjs';
import { PublicController } from '@/public/public.controller.mjs';
import { AssetModule } from '@/modules/asset/asset.module.mjs';
import { FeedModule } from '@/modules/feed/feed.module.mjs';

@Module({
  imports: [PostModule, AssetModule, FeedModule],
  providers: [PublicService],
  controllers: [PublicController],
})
export class PublicModule {}
