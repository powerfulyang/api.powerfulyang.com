import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OauthOpenid } from '@/modules/oauth-openid/entities/oauth-openid.entity';
import { OauthOpenidService } from './oauth-openid.service';
import { OauthOpenidController } from './oauth-openid.controller';
import { OauthApplicationModule } from '@/modules/oauth-application/oauth-application.module';

@Module({
  imports: [TypeOrmModule.forFeature([OauthOpenid]), OauthApplicationModule],
  controllers: [OauthOpenidController],
  providers: [OauthOpenidService],
  exports: [OauthOpenidService],
})
export class OauthOpenidModule {}
