import type { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import type { Observable } from 'rxjs';
import { map } from 'rxjs';
import { LoggerService } from '@/common/logger/logger.service';
import { UserService } from '@/modules/user/user.service';
import { Authorization, DefaultCookieOptions } from '@/constants/constants';
import { PathViewCountService } from '@/modules/path-view-count/path-view-count.service';
import type { ExtendRequest } from '@/type/ExtendRequest';
import type { FastifyReply } from 'fastify';
import { getBaseDomain } from '@/common/interceptor/cookie.interceptor';
import { HOSTNAME } from '@/utils/hostname';
import { DateTimeFormat } from '@/utils/dayjs';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  constructor(
    private logger: LoggerService,
    private userService: UserService,
    private pathViewCountService: PathViewCountService,
  ) {
    this.logger.setContext(ResponseInterceptor.name);
  }

  intercept(_context: ExecutionContext, next: CallHandler): Observable<any> {
    const ctx = _context.switchToHttp();
    const reply = ctx.getResponse<FastifyReply>();
    const request = ctx.getRequest<ExtendRequest>();
    const path = request.url;
    const { xRealIp } = request.raw.extend;

    return next.handle().pipe(
      map(async (data) => {
        if (request.user) {
          const { user } = request;
          const ValidPeriodSecond = user.exp - Date.now() / 1000;
          const ValidPeriodHour = ValidPeriodSecond / 3600;
          if (ValidPeriodHour < 6) {
            const authorization = await this.userService.generateAuthorization(user);
            const domain = getBaseDomain(request.hostname);
            reply.setCookie(Authorization, authorization, {
              ...DefaultCookieOptions,
              domain,
            });
            this.logger.info(
              `Token valid within ${ValidPeriodHour}hour, refresh token [user=>${user.email}]`,
            );
          } else {
            this.logger.debug(
              `Token valid within ${ValidPeriodHour}hour, it's unnecessary to refresh token [user=>${user.email}]`,
            );
          }
        }
        // 记录访问量等数据都放到 header 中
        let pathViewCount = 0;
        if (xRealIp) {
          pathViewCount = await this.pathViewCountService.handlePathViewCount(path, xRealIp);
        }
        reply.header('x-path-view-count', pathViewCount);
        reply.header('x-server-id', HOSTNAME);
        reply.header('x-server-time', DateTimeFormat());
        reply.header('x-server-path', path);
        // 不再做统一格式处理，直接返回原始数据
        this.logger.verbose(`response handled in ${Date.now() - request.raw.extend.start}ms`);
        return data;
      }),
    );
  }
}
