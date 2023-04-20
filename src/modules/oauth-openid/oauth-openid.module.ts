import { LoggerModule } from '@/common/logger/logger.module';
import { OrmModule } from '@/common/service/orm/orm.module';
import { OauthApplicationModule } from '@/modules/oauth-application/oauth-application.module';
import { OauthOpenid } from '@/modules/oauth-openid/entities/oauth-openid.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OauthOpenidController } from './oauth-openid.controller';
import { OauthOpenidService } from './oauth-openid.service';

@Module({
  imports: [
    OrmModule,
    TypeOrmModule.forFeature([OauthOpenid]),
    OauthApplicationModule,
    LoggerModule,
  ],
  controllers: [OauthOpenidController],
  providers: [OauthOpenidService],
  exports: [OauthOpenidService],
})
export class OauthOpenidModule {}
