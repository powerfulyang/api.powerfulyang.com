import { LoggerService } from '@/common/logger/logger.service';
import { UserService } from '@/user/user.service';
import type { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { omit } from 'lodash';
import { map, tap } from 'rxjs/operators';

@Injectable()
export class LoginInterceptor implements NestInterceptor {
  constructor(
    private readonly logger: LoggerService,
    private readonly userService: UserService,
  ) {
    this.logger.setContext(LoginInterceptor.name);
  }

  intercept(context: ExecutionContext, next: CallHandler) {
    const req = context.switchToHttp().getRequest();
    const ip = Reflect.getMetadata('ip', req.raw);

    return next.handle().pipe(
      tap((data) => {
        const user = data?.user;
        if (user?.id) {
          this.logger.info(`用户 [id=${user.id}] 登录成功, IP: ${ip}`);
          this.userService.updateLoginTime(user.id, ip).catch((err) => {
            this.logger.error(err);
          });
        }
      }),
      map((data) => omit(data, ['user'])),
    );
  }
}
