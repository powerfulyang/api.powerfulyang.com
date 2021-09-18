import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OauthOpenid } from '@/modules/oauth-openid/entities/oauth-openid.entity';
import { OauthOpenidService } from './oauth-openid.service';
import { OauthOpenidController } from './oauth-openid.controller';

@Module({
  imports: [TypeOrmModule.forFeature([OauthOpenid])],
  controllers: [OauthOpenidController],
  providers: [OauthOpenidService],
  exports: [OauthOpenidService],
})
export class OauthOpenidModule {}
