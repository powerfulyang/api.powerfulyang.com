import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from '@/modules/post/entities/post.entity';
import { AssetModule } from '@/modules/asset/asset.module';
import { OrmModule } from '@/common/ORM/orm.module';
import { LoggerModule } from '@/common/logger/logger.module';
import { EsModule } from '@/common/ES/es.module';
import { PostService } from './post.service';
import { PostController } from './post.controller';

@Module({
  imports: [OrmModule, TypeOrmModule.forFeature([Post]), AssetModule, LoggerModule, EsModule],
  providers: [PostService],
  controllers: [PostController],
  exports: [PostService],
})
export class PostModule {}
