import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@/entity/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { UserService } from '@/modules/user/user.service';
import { jwtSecretConfig } from '@/configuration/jwt.config';
import { Menu } from '@/entity/menu.entity';
import { UserController } from './user.controller';
import { MenuService } from './menu/menu.service';
import { MenuController } from './menu/menu.controller';

@Module({
    imports: [
        TypeOrmModule.forFeature([User, Menu]),
        JwtModule.registerAsync({
            useFactory: () => {
                return {
                    secret: jwtSecretConfig(),
                    signOptions: {
                        expiresIn: '30m',
                    },
                };
            },
        }),
    ],
    controllers: [UserController, MenuController],
    providers: [UserService, MenuService],
    exports: [UserService],
})
export class UserModule {}
