import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import type { FastifyRequest } from 'fastify';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { getTokenFromRequest } from '@/common/authorization/util';
import { LoggerService } from '@/common/logger/logger.service';
import type { jwtSecretConfig } from '@/configuration/jwt.config';
import { JWT_SECRET_CONFIG } from '@/constants/PROVIDER_TOKEN';
import type { User } from '@/user/entities/user.entity';
import { UserService } from '@/user/user.service';
import type { FastifyExtendRequest } from '@/type/FastifyExtendRequest';

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

  async validate(
    { raw: { extend } }: FastifyExtendRequest,
    user: User & { iat: number; exp: number },
  ) {
    // to check user status;
    const cachedUser = await this.userService.getCachedUser(user.id);
    if (!cachedUser) {
      throw new UnauthorizedException('User cache not found');
    }
    if (extend.xRealIp) {
      process.nextTick(() => {
        this.userService.updateUserWithoutCache(user.id, {
          lastIp: extend.xRealIp,
          lastAddress: extend.address,
        });
      });
    }
    return Object.assign(cachedUser, { exp: user.exp });
  }
}
