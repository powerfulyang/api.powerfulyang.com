import { CacheModule, Global, Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { PixivBotModule } from 'api/pixiv-bot';
import { InstagramBotModule } from 'api/instagram-bot';
import { PinterestRssModule } from 'api/pinterest-rss';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TencentCloudCosModule } from 'api/tencent-cloud-cos';
import redisStore from 'cache-manager-redis-store';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { Asset } from '@/modules/asset/entities/asset.entity';
import { Bucket } from '@/modules/bucket/entities/bucket.entity';
import { redisConfig } from '@/configuration/redis.config';
import { SearchService } from '@/core/search/search.service';
import { elasticsearchConfig } from '@/configuration/elasticsearch.config';
import { rabbitmqClientConfig } from '@/configuration/rabbitmq.config';
import { MICROSERVICE_NAME } from '@/constants/constants';
import { Feed } from '@/modules/feed/entities/feed.entity';
import { UploadAssetModule } from '@/microservice/handleAsset/upload-asset.module';
import { CoreService } from './core.service';
import { CacheService } from './cache/cache.service';

@Global()
@Module({
  imports: [
    ClientsModule.registerAsync([
      {
        name: MICROSERVICE_NAME,
        useFactory() {
          return rabbitmqClientConfig();
        },
      },
    ]),
    PixivBotModule,
    InstagramBotModule,
    PinterestRssModule,
    TypeOrmModule.forFeature([Asset, Bucket, Feed]),
    TencentCloudCosModule,
    CacheModule.registerAsync({
      useFactory: () => {
        return { store: redisStore, ...redisConfig(), ttl: Infinity };
      },
    }),
    ElasticsearchModule.registerAsync({
      useFactory: () => {
        return elasticsearchConfig();
      },
    }),
    UploadAssetModule,
  ],
  providers: [CoreService, CacheService, SearchService],
  exports: [CoreService, CacheService, SearchService],
})
export class CoreModule {}
