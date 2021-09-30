import type { MiddlewareConsumer, NestModule } from '@nestjs/common';
import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { ProxyFetchModule } from 'api/proxy-fetch';
import { GithubModule } from 'app/github-webhook';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { UdpServerModule } from 'api/udp-server';
import { TelegramBotModule } from 'api/telegram-bot';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { RequestMiddleware } from '@/common/middleware/request.middleware';
import { AppLogger } from '@/common/logger/app.logger';
import { LoggerModule } from '@/common/logger/logger.module';
import { StrategyModule } from '@/common/authorization/strategy.module';
import { CoreModule } from '@/core/core.module';
import { ResponseInterceptor } from '@/common/interceptor/response.interceptor';
import { PathViewCountModule } from '@/modules/path-ip-view-count/path-view-count.module';
import { ScheduleModule } from '@/modules/schedule/schedule.module';
import { OrmModule } from '@/core/orm.module';
import { BootstrapModule } from '@/core/bootstrap/bootstrap.module';
import { BootstrapService } from '@/core/bootstrap/bootstrap.service';
import { UploadAssetModule } from './microservice/handleAsset/upload-asset.module';
import { UserModule } from './modules/user/user.module';
import { BucketModule } from './modules/bucket/bucket.module';
import { AssetModule } from './modules/asset/asset.module';
import { PostModule } from './modules/post/post.module';
import { PublicModule } from './public/public.module';
import { FeedModule } from './modules/feed/feed.module';
import { OauthOpenidModule } from './modules/oauth-openid/oauth-openid.module';
import { TencentCloudAccountModule } from './modules/tencent-cloud-account/tencent-cloud-account.module';
import { OauthApplicationModule } from './modules/oauth-application/oauth-application.module';

@Module({
  imports: [
    LoggerModule,
    OrmModule,
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
    consumer.apply(RequestMiddleware).forRoutes('*');
  }
}
