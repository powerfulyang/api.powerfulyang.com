import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from '@/module/user.module';
import { CoreModule } from '@/core/core.module';
import { AuthStrategyModule } from '@/common/authorization/AuthStrategy.module';
import { ProxyFetchModule } from 'api/proxy-fetch';
import { LoggerModule } from '@/common/logger/logger.module';
import { AssetModule } from './module/asset.module';
import { config } from './mysql/config';
import { UploadAssetModule } from './microservice/upload-asset.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: ['.env'],
        }),
        LoggerModule,
        TypeOrmModule.forRoot(config),
        ProxyFetchModule,
        AuthStrategyModule,
        CoreModule,
        PassportModule,
        AssetModule,
        UserModule,
        UploadAssetModule,
    ],
})
export class AppModule {}
