import { CacheModule, Global, Module } from '@nestjs/common';
import { ClientsModule } from '@nestjs/microservices';
import { TypeOrmModule } from '@nestjs/typeorm';
import redisStore from 'cache-manager-redis-store';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { Asset } from '@/modules/asset/entities/asset.entity';
import { CosBucket } from '@/modules/bucket/entities/bucket.entity';
import { redisConfig } from '@/configuration/redis.config';
import { SearchService } from '@/core/search/search.service';
import { elasticsearchConfig } from '@/configuration/elasticsearch.config';
import { rabbitmqClientConfig } from '@/configuration/rabbitmq.config';
import { MICROSERVICE_NAME } from '@/constants/constants';
import { Feed } from '@/modules/feed/entities/feed.entity';
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
    TypeOrmModule.forFeature([Asset, CosBucket, Feed]),
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
