import { Injectable } from '@nestjs/common';
import { AppLogger } from '@/common/logger/app.logger';
import { rabbitmqClientConfig } from '@/configuration/rabbitmq.config';
import { redisConfig } from '@/configuration/redis.config';
import { elasticsearchConfig } from '@/configuration/elasticsearch.config';
import { pgConfig } from '@/configuration/pg.config';
import { jwtSecretConfig } from '@/configuration/jwt.config';
import { mailConfig } from '@/configuration/mail.config';

@Injectable()
export class ConfigService {
  constructor(private readonly logger: AppLogger) {
    this.logger.setContext(ConfigService.name);
  }

  getRabbitmqClientConfig() {
    this.logger.info('==================getRabbitmqClientConfig==================');
    return rabbitmqClientConfig();
  }

  getRedisConfig() {
    this.logger.info('==================getRedisConfig==================');
    return redisConfig();
  }

  getElasticsearchConfig() {
    this.logger.info('==================getElasticsearchConfig==================');
    return elasticsearchConfig();
  }

  getPostgresConfig() {
    this.logger.info('==================getPostgresConfig==================');
    return pgConfig();
  }

  getJwtConfig() {
    this.logger.info('==================getJwtSecret==================');
    return jwtSecretConfig();
  }

  getMailConfig() {
    this.logger.info('==================getMailConfig==================');
    return mailConfig();
  }
}
