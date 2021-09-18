import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@/modules/user/entities/user.entity';
import { JwtModule } from '@nestjs/jwt';
import { UserService } from '@/modules/user/user.service';
import { jwtSecretConfig } from '@/configuration/jwt.config';
import { Menu } from '@/modules/user/entities/menu.entity';
import { Role } from '@/modules/user/entities/role.entity';
import { Family } from '@/modules/user/entities/family.entity';
import { OauthOpenidModule } from '@/modules/oauth-openid/oauth-openid.module';
import { UserController } from './user.controller';
import { MenuService } from './menu/menu.service';
import { MenuController } from './menu/menu.controller';
import { RoleService } from './role/role.service';
import { RoleController } from './role/role.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Menu, Role, Family]),
    JwtModule.registerAsync({
      useFactory: () => {
        return {
          secret: jwtSecretConfig(),
          signOptions: {
            expiresIn: '1d',
          },
        };
      },
    }),
    OauthOpenidModule,
  ],
  controllers: [UserController, MenuController, RoleController],
  providers: [UserService, MenuService, RoleService],
  exports: [UserService],
})
export class UserModule {}
