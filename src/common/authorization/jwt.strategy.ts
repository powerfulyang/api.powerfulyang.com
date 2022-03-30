import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable } from '@nestjs/common';
import type { Request } from 'express';
import type { User } from '@/modules/user/entities/user.entity';
import { AppLogger } from '@/common/logger/app.logger';
import { UserService } from '@/modules/user/user.service';
import type { ReqExtend } from '@/type/ReqExtend';
import { JWT_SECRET_CONFIG } from '@/constants/PROVIDER_TOKEN';
import { getTokenFromRequest } from '@/common/authorization/util';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly logger: AppLogger,
    private readonly userService: UserService,
    @Inject(JWT_SECRET_CONFIG) readonly secret: string,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => getTokenFromRequest(request),
      ]),
      secretOrKey: secret,
      passReqToCallback: true,
    });
    this.logger.setContext(JwtStrategy.name);
  }

  async validate({ extend }: ReqExtend, user: User & { iat: number; exp: number }) {
    // to check user status;
    this.logger.debug(`user query [ id: ${user.id} ] !`);
    const cachedUser = await this.userService.getCachedUser(user.id);
    process.nextTick(() => {
      this.userService.updateUserWithoutCache(user.id, {
        lastIp: extend.xRealIp,
        lastAddress: extend.address,
      });
    });
    return { ...cachedUser, exp: user.exp };
  }
}
