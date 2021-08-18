import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { User } from '@/entity/user.entity';
import { Request } from 'express';
import { AppLogger } from '@/common/logger/app.logger';
import { Authorization } from '@/constants/constants';
import { jwtSecretConfig } from '@/configuration/jwt.config';
import { UserService } from '@/modules/user/user.service';
import { ReqExtend } from '@/type/ReqExtend';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(private logger: AppLogger, private userService: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request?.cookies?.[Authorization] || request?.header(Authorization);
        },
      ]),
      secretOrKey: jwtSecretConfig(),
      passReqToCallback: true,
    });
    this.logger.setContext(JwtStrategy.name);
  }

  async validate({ extend }: ReqExtend, user: User & { iat: number; exp: number }) {
    // to check user status;
    this.logger.debug(`[user id is ${user.id}]-> query current!`);
    const resUser = await this.userService.getCachedUsers(user.id);
    process.nextTick(() => {
      this.userService.userDao.update(user.id, {
        lastIp: extend.ip,
        lastAddress: extend.address,
      });
    });
    return Object.assign(resUser, { exp: user.exp });
  }
}
