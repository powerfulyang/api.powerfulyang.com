import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { User } from '@/modules/user/entities/user.entity';
import { UserService } from '@/modules/user/user.service';
import { jwtSecret } from '@/configuration/jwt.config';
import { Menu } from '@/modules/user/entities/menu.entity';
import { Role } from '@/modules/user/entities/role.entity';
import { Family } from '@/modules/user/entities/family.entity';
import { OauthOpenidModule } from '@/modules/oauth-openid/oauth-openid.module';
import { UserController } from './user.controller';
import { MenuService } from './menu/menu.service';
import { MenuController } from './menu/menu.controller';
import { RoleService } from './role/role.service';
import { RoleController } from './role/role.controller';
import { OauthApplicationModule } from '@/modules/oauth-application/oauth-application.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Menu, Role, Family]),
    JwtModule.registerAsync({
      useFactory: () => {
        return {
          secret: jwtSecret(),
          signOptions: {
            expiresIn: '1d',
          },
        };
      },
    }),
    OauthOpenidModule,
    OauthApplicationModule,
  ],
  controllers: [UserController, MenuController, RoleController],
  providers: [UserService, MenuService, RoleService],
  exports: [UserService, RoleService],
})
export class UserModule {}
