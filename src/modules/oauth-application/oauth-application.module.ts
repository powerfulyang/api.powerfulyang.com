import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OauthApplicationService } from './oauth-application.service';
import { OauthApplicationController } from './oauth-application.controller';
import { OauthApplication } from '@/modules/oauth-application/entities/oauth-application.entity';
import { LoggerModule } from '@/common/logger/logger.module';
import { OrmModule } from '@/common/ORM/orm.module';

@Module({
  imports: [OrmModule, TypeOrmModule.forFeature([OauthApplication]), LoggerModule],
  controllers: [OauthApplicationController],
  providers: [OauthApplicationService],
  exports: [OauthApplicationService],
})
export class OauthApplicationModule {}
