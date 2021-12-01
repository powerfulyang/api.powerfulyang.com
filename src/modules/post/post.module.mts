import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from '@/modules/post/entities/post.entity.mjs';
import { AssetModule } from '@/modules/asset/asset.module.mjs';
import { PostService } from './post.service.mjs';
import { PostController } from './post.controller.mjs';

@Module({
  imports: [TypeOrmModule.forFeature([Post]), AssetModule],
  providers: [PostService],
  controllers: [PostController],
  exports: [PostService],
})
export class PostModule {}
