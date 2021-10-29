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
    const config = rabbitmqClientConfig();
    this.logger.info('getRabbitmqClientConfig');
    return config;
  }

  getRedisConfig() {
    this.logger.info('getRedisConfig');
    return redisConfig();
  }

  getElasticsearchConfig() {
    this.logger.info('getElasticsearchConfig');
    return elasticsearchConfig();
  }

  getPostgreConfig() {
    this.logger.info('getPostgreConfig');
    return pgConfig();
  }

  getJwtSecret() {
    this.logger.info('getJwtSecret');
    return jwtSecret();
  }
}
