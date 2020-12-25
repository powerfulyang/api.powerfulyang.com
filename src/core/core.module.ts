import { CacheModule, Global, Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
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
import { elasticsearchConfig } from '@/configuration/elasticsearch.config';
import { rabbitmqClientConfig } from '@/configuration/rabbitmq.config';
import { CoreService } from './core.service';
import { CacheService } from './cache/cache.service';

@Global()
@Module({
  imports: [
    ClientsModule.register([rabbitmqClientConfig()]),
    PixivBotModule,
    InstagramBotModule,
    PinterestRssModule,
    TypeOrmModule.forFeature([Asset, Bucket]),
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
  ],
  providers: [CoreService, CacheService, SearchService],
  exports: [CoreService, CacheService, SearchService],
})
export class CoreModule {}
