import type { MiddlewareConsumer, NestModule } from '@nestjs/common';
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { ProxyFetchModule } from 'api/proxy-fetch/index.mjs';
import { GithubModule } from 'app/github-webhook/index.mjs';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { UdpServerModule } from 'api/udp-server/index.mjs';
import { TelegramBotModule } from 'api/telegram-bot/index.mjs';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { RequestMiddleware } from '@/common/middleware/request.middleware.mjs';
import { AppLogger } from '@/common/logger/app.logger.mjs';
import { LoggerModule } from '@/common/logger/logger.module.mjs';
import { StrategyModule } from '@/common/authorization/strategy.module.mjs';
import { CoreModule } from '@/core/core.module.mjs';
import { ResponseInterceptor } from '@/common/interceptor/response.interceptor.mjs';
import { PathViewCountModule } from '@/modules/path-ip-view-count/path-view-count.module.mjs';
import { ScheduleModule } from '@/modules/schedule/schedule.module.mjs';
import { BootstrapModule } from '@/core/bootstrap/bootstrap.module.mjs';
import { BootstrapService } from '@/core/bootstrap/bootstrap.service.mjs';
import { UploadAssetModule } from './microservice/handleAsset/upload-asset.module.mjs';
import { UserModule } from './modules/user/user.module.mjs';
import { BucketModule } from './modules/bucket/bucket.module.mjs';
import { AssetModule } from './modules/asset/asset.module.mjs';
import { PostModule } from './modules/post/post.module.mjs';
import { PublicModule } from './public/public.module.mjs';
import { FeedModule } from './modules/feed/feed.module.mjs';
import { OauthOpenidModule } from './modules/oauth-openid/oauth-openid.module.mjs';
import { TencentCloudAccountModule } from './modules/tencent-cloud-account/tencent-cloud-account.module.mjs';
import { OauthApplicationModule } from './modules/oauth-application/oauth-application.module.mjs';

@Module({
  imports: [
    LoggerModule,
    ProxyFetchModule.forRoot(),
    StrategyModule,
    CoreModule,
    PassportModule,
    UserModule,
    UploadAssetModule,
    GithubModule,
    BucketModule,
    AssetModule,
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'assets'),
    }),
    UdpServerModule,
    TelegramBotModule,
    PostModule,
    PublicModule,
    PathViewCountModule,
    ScheduleModule,
    FeedModule,
    BootstrapModule,
    OauthOpenidModule,
    TencentCloudAccountModule,
    OauthApplicationModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
  ],
})
export class AppModule implements NestModule {
  constructor(private logger: AppLogger, private bootstrapService: BootstrapService) {
    this.logger.setContext(AppModule.name);
    this.bootstrapService.bootstrap().then(() => {
      this.logger.info('loaded bootstrap scripts!');
    });
  }

  configure(consumer: MiddlewareConsumer) {
    this.logger.info('register request middleware for path *');
    consumer.apply(RequestMiddleware).forRoutes('*');
  }
}
