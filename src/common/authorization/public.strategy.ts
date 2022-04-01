import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport';
import type { Request } from 'express';
import { UserService } from '@/modules/user/user.service';
import { getTokenFromRequest } from '@/common/authorization/util';
import { LoggerService } from '@/common/logger/logger.service';

@Injectable()
export class PublicStrategy extends PassportStrategy(Strategy, 'public') {
  constructor(private readonly userService: UserService, private readonly logger: LoggerService) {
    super();
    this.logger.setContext(PublicStrategy.name);
  }

  async authenticate(req: Request) {
    try {
      // 解析 token 成功 获取到用户信息
      const user = await this.userService.verifyAuthorization(getTokenFromRequest(req));
      const res = await this.userService.getCachedUser(user.id);
      this.success(res);
    } catch (e) {
      // 解析 token 失败 无法获取用户信息
      this.pass();
    }
  }
}