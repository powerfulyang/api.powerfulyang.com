import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '@nestjs/config';
import { GithubModule } from 'app/github-webhook';
import { UserModule } from '@/module/user.module';
import { StaticModule } from './module/static.module';
import { config } from './mysql/config';
import { JwtStrategy } from './common/authorization/JwtStrategy';
import { UploadStaticModule } from './microservice/upload-static.module';

@Module({
    imports: [
        ConfigModule.forRoot({
            envFilePath: ['.env'],
        }),
        TypeOrmModule.forRoot(config),
        PassportModule,
        StaticModule,
        UserModule,
        GithubModule,
        UploadStaticModule,
    ],
    providers: [JwtStrategy],
})
export class AppModule {}
