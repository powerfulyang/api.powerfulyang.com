import type { MiddlewareConsumer, NestModule } from '@nestjs/common';
import { Module, ValidationPipe } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { GithubModule } from 'app/github-webhook';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { UdpServerModule } from 'api/udp-server';
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import cookieParser from 'cookie-parser';
import { RequestMiddleware } from '@/common/middleware/request.middleware';
import { LoggerService } from '@/common/logger/logger.service';
import { LoggerModule } from '@/common/logger/logger.module';
import { StrategyModule } from '@/common/authorization/strategy.module';
import { ResponseInterceptor } from '@/common/interceptor/response.interceptor';
import { PathViewCountModule } from '@/modules/path-view-count/path-view-count.module';
import { ScheduleModule } from '@/modules/schedule/schedule.module';
import { BootstrapModule } from '@/core/bootstrap/bootstrap.module';
import { BootstrapService } from '@/core/bootstrap/bootstrap.service';
import { CatchFilter } from '@/common/filter/catch.filter';
import { HttpExceptionFilter } from '@/common/filter/http.exception.filter';
import { LogsViewerModule } from 'api/logs-viewer';
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
    StrategyModule,
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
    PostModule,
    PublicModule,
    PathViewCountModule,
    ScheduleModule,
    FeedModule,
    BootstrapModule,
    OauthOpenidModule,
    TencentCloudAccountModule,
    OauthApplicationModule,
    LogsViewerModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: CatchFilter, // second
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter, // first
    },
    {
      provide: APP_PIPE,
      useClass: ValidationPipe,
    },
  ],
})
export class AppModule implements NestModule {
  constructor(private logger: LoggerService, private bootstrapService: BootstrapService) {
    this.logger.setContext(AppModule.name);
    this.bootstrapService.bootstrap().then(() => {
      this.logger.info('loaded bootstrap scripts!');
    });
  }

  configure(consumer: MiddlewareConsumer) {
    this.logger.verbose('register RequestMiddleware & CookieParser middleware for path *');
    consumer.apply(RequestMiddleware).forRoutes('*');
    consumer.apply(cookieParser()).forRoutes('*');
  }
}
