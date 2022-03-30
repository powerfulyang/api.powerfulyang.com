import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { User } from '@/modules/user/entities/user.entity';
import { UserService } from '@/modules/user/user.service';
import { Family } from '@/modules/user/entities/family.entity';
import { OauthOpenidModule } from '@/modules/oauth-openid/oauth-openid.module';
import { UserController } from './user.controller';
import { MenuService } from './menu/menu.service';
import { MenuController } from './menu/menu.controller';
import { RoleService } from './role/role.service';
import { RoleController } from './role/role.controller';
import { MailModule } from '@/common/mail/mail.module';
import { CacheModule } from '@/common/cache/cache.module';
import { ConfigModule } from '@/common/config/config.module';
import { ConfigService } from '@/common/config/config.service';
import { LoggerModule } from '@/common/logger/logger.module';
import { Menu } from '@/modules/user/entities/menu.entity';
import { Role } from '@/modules/user/entities/role.entity';
import { OrmModule } from '@/common/ORM/orm.module';

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
  controllers: [UserController, MenuController, RoleController],
  providers: [UserService, MenuService, RoleService],
  exports: [UserService, RoleService],
})
export class UserModule {}
