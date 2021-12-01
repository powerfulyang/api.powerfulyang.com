import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { User } from '@/modules/user/entities/user.entity.mjs';
import { UserService } from '@/modules/user/user.service.mjs';
import { jwtSecret } from '@/configuration/jwt.config.mjs';
import { Menu } from '@/modules/user/entities/menu.entity.mjs';
import { Role } from '@/modules/user/entities/role.entity.mjs';
import { Family } from '@/modules/user/entities/family.entity.mjs';
import { OauthOpenidModule } from '@/modules/oauth-openid/oauth-openid.module.mjs';
import { UserController } from './user.controller.mjs';
import { MenuService } from './menu/menu.service.mjs';
import { MenuController } from './menu/menu.controller.mjs';
import { RoleService } from './role/role.service.mjs';
import { RoleController } from './role/role.controller.mjs';
import { OauthApplicationModule } from '@/modules/oauth-application/oauth-application.module.mjs';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Menu, Role, Family]),
    JwtModule.registerAsync({
      useFactory: () => ({
          secret: jwtSecret(),
          signOptions: {
            expiresIn: '1d',
          },
        }),
    }),
    OauthOpenidModule,
    OauthApplicationModule,
  ],
  controllers: [UserController, MenuController, RoleController],
  providers: [UserService, MenuService, RoleService],
  exports: [UserService, RoleService],
})
export class UserModule {}
