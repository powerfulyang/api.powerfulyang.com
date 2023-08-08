import { Strategy } from '@fastify/passport';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { getTokenFromRequest } from '@/common/authorization/util';
import { LoggerService } from '@/common/logger/logger.service';
import { UserService } from '@/user/user.service';

@Injectable()
export class PublicStrategy extends PassportStrategy(Strategy, 'public') {
  constructor(
    private readonly userService: UserService,
    private readonly logger: LoggerService,
  ) {
    super();
    this.logger.setContext(PublicStrategy.name);
  }

  async authenticate(req: any) {
    try {
      // 解析 token 成功 获取到用户信息
      const user = await this.userService.verifyAuthorization(getTokenFromRequest(req));
      const res = await this.userService.getCachedUser(user.id);
      if (!res) {
        this.pass();
        return;
      }
      this.success({ ...user, ...res });
    } catch (e) {
      // 解析 token 失败 无法获取用户信息
      this.pass();
    }
  }
}
