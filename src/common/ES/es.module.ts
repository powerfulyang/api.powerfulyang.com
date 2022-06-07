import { Module } from '@nestjs/common';
import { ElasticsearchModule } from '@nestjs/elasticsearch';
import { ConfigModule } from '@/common/config/config.module';
import { ConfigService } from '@/common/config/config.service';
import { EsService } from '@/common/ES/es.service';
import { LoggerModule } from '@/common/logger/logger.module';
import { PostModule } from '@/modules/post/post.module';

@Module({
  imports: [
    ElasticsearchModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => configService.getElasticsearchConfig(),
    }),
    LoggerModule,
    PostModule,
  ],
  exports: [EsService],
  providers: [EsService],
})
export class EsModule {}
