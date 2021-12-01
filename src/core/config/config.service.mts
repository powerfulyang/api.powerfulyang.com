import { Injectable } from '@nestjs/common';
import { AppLogger } from '@/common/logger/app.logger.mjs';
import { rabbitmqClientConfig } from '@/configuration/rabbitmq.config.mjs';
import { redisConfig } from '@/configuration/redis.config.mjs';
import { elasticsearchConfig } from '@/configuration/elasticsearch.config.mjs';
import { pgConfig } from '@/configuration/pg.config.mjs';
import { jwtSecret } from '@/configuration/jwt.config.mjs';

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
