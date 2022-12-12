import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from '@/modules/post/entities/post.entity';
import { AssetModule } from '@/modules/asset/asset.module';
import { OrmModule } from '@/common/service/orm/orm.module';
import { LoggerModule } from '@/common/logger/logger.module';
import { PostService } from './post.service';
import { PostController } from './post.controller';

@Module({
  imports: [OrmModule, TypeOrmModule.forFeature([Post]), AssetModule, LoggerModule],
  providers: [PostService],
  controllers: [PostController],
  exports: [PostService],
})
export class PostModule {}
