import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OauthOpenid } from '@/modules/oauth-openid/entities/oauth-openid.entity.mjs';
import { OauthOpenidService } from './oauth-openid.service.mjs';
import { OauthOpenidController } from './oauth-openid.controller.mjs';
import { OauthApplicationModule } from '@/modules/oauth-application/oauth-application.module.mjs';

@Module({
  imports: [TypeOrmModule.forFeature([OauthOpenid]), OauthApplicationModule],
  controllers: [OauthOpenidController],
  providers: [OauthOpenidService],
  exports: [OauthOpenidService],
})
export class OauthOpenidModule {}
