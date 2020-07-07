import { Module, Scope } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../entity/user.entity';
import { UserController } from '../controller/user.controller';
import { JwtModule } from '@nestjs/jwt';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ResponseFormatInterceptor } from '../common/interceptors/response.format.interceptor';

@Module({
    imports: [
        TypeOrmModule.forFeature([User]),
        JwtModule.register({
            secret: process.env.JWT_SECRET,
            signOptions: { expiresIn: '30m' },
        }),
    ],
    providers: [
        { provide: APP_INTERCEPTOR, useClass: ResponseFormatInterceptor, scope: Scope.REQUEST },
    ],
    controllers: [UserController],
})
export class UserModule {}
