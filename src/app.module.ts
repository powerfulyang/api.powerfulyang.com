import { StrategyModule } from '@/common/authorization/strategy.module';
import { CatchFilter } from '@/common/filter/catch.filter';
import { ErrorFilter } from '@/common/filter/error.filter';
import { HttpExceptionFilter } from '@/common/filter/http.exception.filter';
import { ResponseInterceptor } from '@/common/interceptor/response.interceptor';
import { LoggerModule } from '@/common/logger/logger.module';
import { LoggerService } from '@/common/logger/logger.service';
import { RequestMiddleware } from '@/common/middleware/request.middleware';
import { BootstrapModule } from '@/core/bootstrap/bootstrap.module';
import { BootstrapService } from '@/core/bootstrap/bootstrap.service';
import { GithubModule } from '@/libs/github';
import { WechatModule } from '@/libs/wechat';
import { PathViewCountModule } from '@/path-view-count/path-view-count.module';
import { ScheduleModule } from '@/schedule/schedule.module';
import type { ApolloDriverConfig } from '@nestjs/apollo';
import { ApolloDriver } from '@nestjs/apollo';
import type { MiddlewareConsumer, NestModule } from '@nestjs/common';
import { Module, ValidationPipe } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { GraphQLModule } from '@nestjs/graphql';
import { PassportModule } from '@nestjs/passport';
import { join } from 'node:path';
import process from 'node:process';
import { AssetModule } from '@/asset/asset.module';
import { FcmModule } from '@/fcm/fcm.module';
import { UploadAssetModule } from '@/microservice/handleAsset/upload-asset.module';
import { BucketModule } from '@/bucket/bucket.module';
import { FeedModule } from '@/feed/feed.module';
import { OauthApplicationModule } from '@/oauth-application/oauth-application.module';
import { OauthOpenidModule } from '@/oauth-openid/oauth-openid.module';
import { PostModule } from '@/post/post.module';
import { PublicModule } from '@/public/public.module';
import { TencentCloudAccountModule } from '@/tencent-cloud-account/tencent-cloud-account.module';
import { UserModule } from '@/user/user.module';
import { ToolsModule } from './tools/tools.module';
import { WebPushModule } from './web-push/web-push.module';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), '__generated__/graphql/schema.graphql'),
    }),
    LoggerModule,
    StrategyModule,
    PassportModule,
    UserModule,
    UploadAssetModule,
    GithubModule,
    BucketModule,
    AssetModule,
    PostModule,
    PublicModule,
    PathViewCountModule,
    ScheduleModule,
    FeedModule,
    BootstrapModule,
    OauthOpenidModule,
    TencentCloudAccountModule,
    OauthApplicationModule,
    WechatModule,
    ToolsModule,
    FcmModule,
    WebPushModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: CatchFilter,
    },
    {
      provide: APP_FILTER,
      useClass: ErrorFilter, // second
    },
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter, // first
    },
    {
      provide: APP_PIPE,
      // default forbidUnknownValues: true, is too strict
      useClass: ValidationPipe,
    },
  ],
})
export class AppModule implements NestModule {
  constructor(
    private readonly logger: LoggerService,
    private readonly bootstrapService: BootstrapService,
  ) {
    this.logger.setContext(AppModule.name);
    this.bootstrapService.bootstrap().then(() => {
      this.logger.info('bootstrap done');
    });
  }

  configure(consumer: MiddlewareConsumer) {
    this.logger.verbose('register RequestMiddleware & CookieParser middleware for path *');
    consumer.apply(RequestMiddleware).forRoutes('*');
  }
}
