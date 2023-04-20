import { LoggerModule } from '@/common/logger/logger.module';
import { AlgoliaService } from '@/common/service/algolia/AlgoliaService';
import { OrmModule } from '@/common/service/orm/orm.module';
import { AssetModule } from '@/modules/asset/asset.module';
import { PostLog } from '@/modules/post/entities/post-log.entity';
import { Post } from '@/modules/post/entities/post.entity';
import { PostManageController } from '@/modules/post/post-manage.controller';
import { PostResolver } from '@/modules/post/resolver/post.resolver';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostController } from './post.controller';
import { PostService } from './post.service';

@Module({
  imports: [OrmModule, TypeOrmModule.forFeature([Post, PostLog]), AssetModule, LoggerModule],
  providers: [PostService, AlgoliaService, PostResolver],
  controllers: [PostController, PostManageController],
  exports: [PostService],
})
export class PostModule {}
