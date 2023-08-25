import { getTokenFromRequest } from '@/common/authorization/util';
import { LoggerService } from '@/common/logger/logger.service';
import type { jwtSecretConfig } from '@/configuration/jwt.config';
import { JWT_SECRET_CONFIG } from '@/constants/PROVIDER_TOKEN';
import type { RequestUser } from '@/request/namespace';
import { setRequestUser } from '@/request/namespace';
import { UserService } from '@/user/user.service';
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import type { FastifyRequest } from 'fastify';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly logger: LoggerService,
    private readonly userService: UserService,
    @Inject(JWT_SECRET_CONFIG) readonly config: ReturnType<typeof jwtSecretConfig>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        // @ts-ignore
        (request: FastifyRequest) => getTokenFromRequest(request),
      ]),
      secretOrKey: config.secret,
      passReqToCallback: true,
    });
    this.logger.setContext(JwtStrategy.name);
  }

  async validate(_: unknown, user: RequestUser) {
    // to check user status;
    const cachedUser = await this.userService.getCachedUser(user.id);
    if (!cachedUser) {
      throw new UnauthorizedException('User cache not found');
    }
    const result = Object.assign(cachedUser, { exp: user.exp, iat: user.iat });
    setRequestUser(result);
    return result;
  }
}
