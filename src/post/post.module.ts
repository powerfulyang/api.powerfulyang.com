import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerModule } from '@/common/logger/logger.module';
import { AlgoliaService } from '@/service/algolia/AlgoliaService';
import { OrmModule } from '@/service/typeorm/orm.module';
import { AssetModule } from '@/asset/asset.module';
import { PostLog } from '@/post/entities/post-log.entity';
import { Post } from '@/post/entities/post.entity';
import { PostManageController } from '@/post/post-manage.controller';
import { PostResolver } from '@/post/post.resolver';
import { PostController } from './post.controller';
import { PostService } from './post.service';

@Module({
  imports: [OrmModule, TypeOrmModule.forFeature([Post, PostLog]), AssetModule, LoggerModule],
  providers: [PostService, AlgoliaService, PostResolver],
  controllers: [PostController, PostManageController],
  exports: [PostService],
})
export class PostModule {}
