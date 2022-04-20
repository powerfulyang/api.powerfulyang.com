import { Injectable } from '@nestjs/common';
import { LoggerService } from '@/common/logger/logger.service';
import { rabbitmqClientConfig } from '@/configuration/rabbitmq.config';
import { redisConfig } from '@/configuration/redis.config';
import { elasticsearchConfig } from '@/configuration/elasticsearch.config';
import { pgConfig } from '@/configuration/pg.config';
import { jwtSecretConfig } from '@/configuration/jwt.config';
import { mailConfig } from '@/configuration/mail.config';

@Injectable()
export class ConfigService {
  constructor(private readonly logger: LoggerService) {
    this.logger.setContext(ConfigService.name);
  }

  getRabbitmqClientConfig() {
    this.logger.verbose('==================getRabbitmqClientConfig==================');
    return rabbitmqClientConfig();
  }

  getRedisConfig() {
    this.logger.verbose('==================getRedisConfig==================');
    return redisConfig();
  }

  getElasticsearchConfig() {
    this.logger.verbose('==================getElasticsearchConfig==================');
    return elasticsearchConfig();
  }

  getPostgresConfig() {
    this.logger.verbose('==================getPostgresConfig==================');
    return pgConfig();
  }

  getJwtConfig() {
    this.logger.verbose('==================getJwtSecret==================');
    return jwtSecretConfig();
  }

  getMailConfig() {
    this.logger.verbose('==================getMailConfig==================');
    return mailConfig();
  }
}
