import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport';
import type { Request } from 'express';
import { UserService } from '@/modules/user/user.service';
import { getTokenFromRequest } from '@/common/authorization/util';
import { AppLogger } from '@/common/logger/app.logger';

@Injectable()
export class PublicAuthStrategy extends PassportStrategy(Strategy, 'public') {
  constructor(private readonly userService: UserService, private readonly logger: AppLogger) {
    super();
    this.logger.setContext(PublicAuthStrategy.name);
  }

  async authenticate(req: Request) {
    try {
      const user = this.userService.verifyAuthorization(getTokenFromRequest(req));
      const res = await this.userService.getCachedUser(user.id);
      this.success(res);
    } catch (e) {
      // 解析 token 失败
      this.success({});
    }
  }
}
