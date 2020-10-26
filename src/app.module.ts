import {
    MiddlewareConsumer,
    Module,
    NestModule,
} from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '@nestjs/config';
import { CoreModule } from '@/core/core.module';
import { StrategyModule } from '@/common/authorization/strategy.module';
import { ProxyFetchModule } from 'api/proxy-fetch';
import { LoggerModule } from '@/common/logger/logger.module';
import { SchedulesModule } from '@/schedules/schedules.module';
import { GithubModule } from 'app/github-webhook';
import { AppLogger } from '@/common/logger/app.logger';
import { RequestMiddleware } from '@/common/middleware/request.middleware';
import { mysqlConfig } from './configuration/mysql.config';
import { UploadAssetModule } from './microservice/upload-asset.module';
import { UserModule } from './modules/user/user.module';
import { BucketModule } from './modules/bucket/bucket.module';
import { AssetModule } from './modules/asset/asset.module';
import { ScheduleModule } from './modules/schedule/schedule.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: ['.env'],
        }),
        LoggerModule,
        TypeOrmModule.forRoot(mysqlConfig()),
        ProxyFetchModule,
        StrategyModule,
        CoreModule,
        PassportModule,
        UserModule,
        UploadAssetModule,
        SchedulesModule,
        GithubModule,
        BucketModule,
        AssetModule,
        ScheduleModule,
    ],
})
export class AppModule implements NestModule {
    constructor(private logger: AppLogger) {
        this.logger.setContext(AppModule.name);
        this.logger.debug(`NODE_ENV -> ${process.env.NODE_ENV}`);
    }

    configure(consumer: MiddlewareConsumer) {
        consumer.apply(RequestMiddleware).forRoutes('*');
    }
}
