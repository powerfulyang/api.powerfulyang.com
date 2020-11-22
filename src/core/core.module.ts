import { CacheModule, Global, Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MICROSERVICE_NAME, RMQ_QUEUE, RMQ_URLS } from '@/constants/constants';
import { PixivBotModule } from 'api/pixiv-bot';
import { InstagramBotModule } from 'api/instagram-bot';
import { PinterestRssModule } from 'api/pinterest-rss';
import { Asset } from '@/entity/asset.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Bucket } from '@/entity/bucket.entity';
import { TencentCloudCosModule } from 'api/tencent-cloud-cos';
import { CoreController } from '@/core/core.controller';
import redisStore from 'cache-manager-redis-store';
import { PostModule } from '@/modules/post/post.module';
import { CoreService } from './core.service';
import { CacheService } from './cache/cache.service';

@Global()
@Module({
  imports: [
    ClientsModule.register([
      {
        name: MICROSERVICE_NAME,
        transport: Transport.RMQ,
        options: {
          urls: RMQ_URLS,
          queue: RMQ_QUEUE,
          queueOptions: {
            durable: false,
          },
        },
      },
    ]),
    PixivBotModule,
    InstagramBotModule,
    PinterestRssModule,
    TypeOrmModule.forFeature([Asset, Bucket]),
    TencentCloudCosModule,
    CacheModule.register({
      store: redisStore,
      host: 'localhost',
      port: 6379,
      ttl: Infinity,
    }),
    PostModule,
  ],
  providers: [CoreService, CacheService],
  exports: [CoreService, CacheService],
  controllers: [CoreController],
})
export class CoreModule {}
