import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import type { User } from '@/modules/user/entities/user.entity';
import { LoggerService } from '@/common/logger/logger.service';
import { UserService } from '@/modules/user/user.service';
import type { ExtendRequest } from '@/type/ExtendRequest';
import { JWT_SECRET_CONFIG } from '@/constants/PROVIDER_TOKEN';
import { getTokenFromRequest } from '@/common/authorization/util';
import type { jwtSecretConfig } from '@/configuration/jwt.config';
import type { FastifyRequest } from 'fastify';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly logger: LoggerService,
    private readonly userService: UserService,
    @Inject(JWT_SECRET_CONFIG) readonly config: ReturnType<typeof jwtSecretConfig>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        ((request: FastifyRequest) => getTokenFromRequest(request)) as any,
      ]),
      secretOrKey: config.secret,
      passReqToCallback: true,
    });
    this.logger.setContext(JwtStrategy.name);
  }

  async validate({ raw: { extend } }: ExtendRequest, user: User & { iat: number; exp: number }) {
    // to check user status;
    const cachedUser = await this.userService.getCachedUser(user.id);
    if (!cachedUser) {
      throw new UnauthorizedException('User cache not found');
    }
    process.nextTick(() => {
      this.userService.updateUserWithoutCache(user.id, {
        lastIp: extend.xRealIp,
        lastAddress: extend.address,
      });
    });
    return Object.assign(cachedUser, { exp: user.exp });
  }
}
