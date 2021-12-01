import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable } from '@nestjs/common';
import type { Request } from 'express';
import type { User } from '@/modules/user/entities/user.entity.mjs';
import { AppLogger } from '@/common/logger/app.logger.mjs';
import { UserService } from '@/modules/user/user.service.mjs';
import type { ReqExtend } from '@/type/ReqExtend.mjs';
import { JWT_SECRET } from '@/constants/PROVIDER_TOKEN.mjs';
import { getTokenFromRequest } from '@/common/authorization/util.mjs';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly logger: AppLogger,
    private readonly userService: UserService,
    @Inject(JWT_SECRET) readonly secret: string,
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
      this.userService.update(user.id, {
        lastIp: extend.xRealIp,
        lastAddress: extend.address,
      });
    });
    return { ...cachedUser, exp: user.exp };
  }
}
