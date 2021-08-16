import { Module } from '@nestjs/common';
import { PostModule } from '@/modules/post/post.module';
import { PublicService } from '@/public/public.service';
import { PublicController } from '@/public/public.controller';
import { AssetModule } from '@/modules/asset/asset.module';

@Module({
  imports: [PostModule, AssetModule],
  providers: [PublicService],
  controllers: [PublicController],
})
export class PublicModule {}
