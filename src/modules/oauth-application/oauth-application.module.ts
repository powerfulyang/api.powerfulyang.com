import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OauthApplicationService } from './oauth-application.service';
import { OauthApplicationController } from './oauth-application.controller';
import { OauthApplication } from '@/modules/oauth-application/entities/oauth-application.entity';

@Module({
  imports: [TypeOrmModule.forFeature([OauthApplication])],
  controllers: [OauthApplicationController],
  providers: [OauthApplicationService],
  exports: [OauthApplicationService],
})
export class OauthApplicationModule {}
