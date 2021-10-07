import { Injectable } from '@nestjs/common';
import { AppLogger } from '@/common/logger/app.logger';
import { rabbitmqClientConfig } from '@/configuration/rabbitmq.config';
import { redisConfig } from '@/configuration/redis.config';
import { elasticsearchConfig } from '@/configuration/elasticsearch.config';
import { pgConfig } from '@/configuration/pg.config';
import { jwtSecret } from '@/configuration/jwt.config';

@Injectable()
export class ConfigService {
  constructor(private readonly logger: AppLogger) {
    this.logger.setContext(ConfigService.name);
  }

  getRabbitmqClientConfig() {
    return rabbitmqClientConfig();
  }

  getRedisConfig() {
    return redisConfig();
  }

  getElasticsearchConfig() {
    return elasticsearchConfig();
  }

  getPostgreConfig() {
    return pgConfig();
  }

  getJwtSecret() {
    return jwtSecret();
  }
}
