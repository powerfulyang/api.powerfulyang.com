import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '@nestjs/config';
import { CoreModule } from '@/core/core.module';
import { StrategyModule } from '@/common/authorization/strategy.module';
import { ProxyFetchModule } from 'api/proxy-fetch';
import { LoggerModule } from '@/common/logger/logger.module';
import { SchedulesModule } from '@/schedules/schedules.module';
import { GithubModule } from 'app/github-webhook';
import { mysqlConfig } from './configuration/mysql.config';
import { UploadAssetModule } from './microservice/upload-asset.module';
import { UserModule } from './modules/user/user.module';
import { BucketModule } from './modules/bucket/bucket.module';

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
    ],
})
export class AppModule {}
