import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@/entity/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { UserService } from '@/modules/user/user.service';
import { jwtSecretConfig } from '@/configuration/jwt.config';
import { UserController } from './user.controller';

@Module({
    imports: [
        TypeOrmModule.forFeature([User]),
        JwtModule.registerAsync({
            useFactory: () => {
                return {
                    secret: jwtSecretConfig(),
                };
            },
        }),
    ],
    controllers: [UserController],
    providers: [UserService],
    exports: [UserService],
})
export class UserModule {}
