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
import redisStore from 'cache-manager-redis-store';
import { redisConfig } from '@/configuration/redis.config';
import { SearchService } from '@/core/search/search.service';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { elasticsearchConfig } from '@/configuration/elasticsearchConfig';
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
          urls: RMQ_URLS(),
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
      ...redisConfig(),
      ttl: Infinity,
    }),
    ElasticsearchModule.registerAsync({
      useFactory: () => {
        return elasticsearchConfig();
      },
    }),
  ],
  providers: [CoreService, CacheService, SearchService],
  exports: [CoreService, CacheService, SearchService],
})
export class CoreModule {}
