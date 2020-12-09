import { Module } from '@nestjs/common';
import { PostModule } from '@/modules/post/post.module';
import { PublicService } from '@/public/public.service';
import { PublicController } from '@/public/public.controller';

@Module({
  imports: [PostModule],
  providers: [PublicService],
  controllers: [PublicController],
})
export class PublicModule {}
