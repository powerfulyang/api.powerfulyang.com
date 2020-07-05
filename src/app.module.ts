import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StaticModule } from './module/static.module';
import config from './config';
import { UserModule } from './module/user.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ResponseFormatInterceptor } from './common/interceptors/response.format.interceptor';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './common/auth/JwtStrategy';

@Module({
    imports: [
        TypeOrmModule.forRoot(config),
        JwtModule.register({
            secret: process.env.JWT_SECRET || '111',
            signOptions: { expiresIn: '30m' },
        }),
        StaticModule,
        UserModule,
    ],
    providers: [{ provide: APP_INTERCEPTOR, useClass: ResponseFormatInterceptor }, JwtStrategy],
})
export class AppModule {}
