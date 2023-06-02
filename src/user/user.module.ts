import { CacheModule } from '@/common/cache/cache.module';
import { ConfigModule } from '@/common/config/config.module';
import { ConfigService } from '@/common/config/config.service';
import { LoggerModule } from '@/common/logger/logger.module';
import { MailModule } from '@/common/service/mail/mail.module';
import { OrmModule } from '@/common/service/orm/orm.module';
import { OauthOpenidModule } from '@/oauth-openid/oauth-openid.module';
import { Family } from '@/user/entities/family.entity';
import { Menu } from '@/user/entities/menu.entity';
import { Role } from '@/user/entities/role.entity';
import { User } from '@/user/entities/user.entity';
import { UserManageController } from '@/user/user-manage.controller';
import { UserService } from '@/user/user.service';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MenuController } from './menu/menu.controller';
import { MenuService } from './menu/menu.service';
import { RoleController } from './role/role.controller';
import { RoleService } from './role/role.service';
import { UserController } from './user.controller';

@Module({
  imports: [
    OrmModule,
    TypeOrmModule.forFeature([User, Family, Menu, Role]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const { secret, expiresIn } = configService.getJwtConfig();
        return {
          secret,
          signOptions: {
            expiresIn,
          },
        };
      },
    }),
    OauthOpenidModule,
    MailModule,
    CacheModule,
    LoggerModule,
  ],
  controllers: [UserController, MenuController, RoleController, UserManageController],
  providers: [UserService, MenuService, RoleService],
  exports: [UserService, MenuService, RoleService],
})
export class UserModule {}
