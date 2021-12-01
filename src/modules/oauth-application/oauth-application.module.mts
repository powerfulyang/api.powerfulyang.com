import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OauthApplicationService } from './oauth-application.service.mjs';
import { OauthApplicationController } from './oauth-application.controller.mjs';
import { OauthApplication } from '@/modules/oauth-application/entities/oauth-application.entity.mjs';

@Module({
  imports: [TypeOrmModule.forFeature([OauthApplication])],
  controllers: [OauthApplicationController],
  providers: [OauthApplicationService],
  exports: [OauthApplicationService],
})
export class OauthApplicationModule {}
