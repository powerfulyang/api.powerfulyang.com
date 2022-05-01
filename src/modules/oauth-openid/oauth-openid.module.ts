import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OauthOpenid } from '@/modules/oauth-openid/entities/oauth-openid.entity';
import { OauthApplicationModule } from '@/modules/oauth-application/oauth-application.module';
import { LoggerModule } from '@/common/logger/logger.module';
import { OrmModule } from '@/common/ORM/orm.module';
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
