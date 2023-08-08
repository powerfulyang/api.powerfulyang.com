import { Module } from '@nestjs/common';
import { ElasticsearchModule as _ElasticsearchModule } from '@nestjs/elasticsearch';
import { ConfigModule } from '@/common/config/config.module';
import { ConfigService } from '@/common/config/config.service';
import { LoggerModule } from '@/common/logger/logger.module';
import { ElasticsearchService } from '@/service/elasticsearch/elasticsearch.service';

@Module({
  imports: [
    LoggerModule,
    _ElasticsearchModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => configService.getElasticsearchConfig(),
    }),
  ],
  exports: [ElasticsearchService],
  providers: [ElasticsearchService],
})
export class ElasticsearchModule {}
