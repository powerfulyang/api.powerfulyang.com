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
import { PathViewCountModule } from '@/modules/path-view-count/path-view-count.module';
import { ScheduleModule } from '@/modules/schedule/schedule.module';
import { WechatModule } from '@app/wechat';
import type { ApolloDriverConfig } from '@nestjs/apollo';
import { ApolloDriver } from '@nestjs/apollo';
import type { MiddlewareConsumer, NestModule } from '@nestjs/common';
import { Inject, Module, ValidationPipe } from '@nestjs/common';
import { APP_FILTER, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { GraphQLModule } from '@nestjs/graphql';
import { PassportModule } from '@nestjs/passport';
import { LogsViewerModule } from 'api/logs-viewer';
import { UdpServerModule } from 'api/udp-server';
import { GithubModule } from 'app/github';
import { join } from 'node:path';
import process from 'node:process';
import { UploadAssetModule } from './microservice/handleAsset/upload-asset.module';
import { AssetModule } from './modules/asset/asset.module';
import { BucketModule } from './modules/bucket/bucket.module';
import { FeedModule } from './modules/feed/feed.module';
import { OauthApplicationModule } from './modules/oauth-application/oauth-application.module';
import { OauthOpenidModule } from './modules/oauth-openid/oauth-openid.module';
import { PostModule } from './modules/post/post.module';
import { PublicModule } from './modules/public/public.module';
import { TencentCloudAccountModule } from './modules/tencent-cloud-account/tencent-cloud-account.module';
import { UserModule } from './modules/user/user.module';
import { ToolsModule } from './tools/tools.module';

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
    WechatModule,
    ToolsModule,
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
    {
      provide: 'APP_BOOTSTRAP',
      inject: [BootstrapService],
      useFactory: async (bootstrapService: BootstrapService) => {
        return bootstrapService.bootstrap();
      },
    },
  ],
})
export class AppModule implements NestModule {
  constructor(
    private readonly logger: LoggerService,
    @Inject('APP_BOOTSTRAP') private readonly bootState: boolean,
  ) {
    this.logger.setContext(AppModule.name);
    this.logger.info(`APP_BOOTSTRAP: ${this.bootState ? 'success' : 'failed'}`);
  }

  configure(consumer: MiddlewareConsumer) {
    this.logger.verbose('register RequestMiddleware & CookieParser middleware for path *');
    consumer.apply(RequestMiddleware).forRoutes('*');
  }
}
