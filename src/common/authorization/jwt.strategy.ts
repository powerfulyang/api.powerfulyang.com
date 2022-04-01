import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable } from '@nestjs/common';
import type { Request } from 'express';
import type { User } from '@/modules/user/entities/user.entity';
import { LoggerService } from '@/common/logger/logger.service';
import { UserService } from '@/modules/user/user.service';
import type { RequestExtend } from '@/type/RequestExtend';
import { JWT_SECRET_CONFIG } from '@/constants/PROVIDER_TOKEN';
import { getTokenFromRequest } from '@/common/authorization/util';
import type { jwtSecretConfig } from '@/configuration/jwt.config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly logger: LoggerService,
    private readonly userService: UserService,
    @Inject(JWT_SECRET_CONFIG) readonly config: ReturnType<typeof jwtSecretConfig>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => getTokenFromRequest(request),
      ]),
      secretOrKey: config.secret,
      passReqToCallback: true,
    });
    this.logger.setContext(JwtStrategy.name);
  }

  async validate({ extend }: RequestExtend, user: User & { iat: number; exp: number }) {
    // to check user status;
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
