import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@/entity/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { UserService } from '@/modules/user/user.service';
import { jwtSecretConfig } from '@/configuration/jwt.config';
import { Menu } from '@/entity/menu.entity';
import { Role } from '@/entity/role.entity';
import { UserController } from './user.controller';
import { MenuService } from './menu/menu.service';
import { MenuController } from './menu/menu.controller';
import { RoleService } from './role/role.service';
import { RoleController } from './role/role.controller';

@Module({
    imports: [
        TypeOrmModule.forFeature([User, Menu, Role]),
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
    controllers: [UserController, MenuController, RoleController],
    providers: [UserService, MenuService, RoleService],
    exports: [UserService],
})
export class UserModule {}
