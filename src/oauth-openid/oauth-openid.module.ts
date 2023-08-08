import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoggerModule } from '@/common/logger/logger.module';
import { OrmModule } from '@/service/typeorm/orm.module';
import { OauthApplicationModule } from '@/oauth-application/oauth-application.module';
import { OauthOpenid } from '@/oauth-openid/entities/oauth-openid.entity';
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
