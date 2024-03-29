import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerModule } from '@/common/logger/logger.module';
import { OrmModule } from '@/service/typeorm/orm.module';
import { OauthApplication } from '@/oauth-application/entities/oauth-application.entity';
import { OauthApplicationController } from './oauth-application.controller';
import { OauthApplicationService } from './oauth-application.service';

@Module({
  imports: [OrmModule, TypeOrmModule.forFeature([OauthApplication]), LoggerModule],
  controllers: [OauthApplicationController],
  providers: [OauthApplicationService],
  exports: [OauthApplicationService],
})
export class OauthApplicationModule {}
