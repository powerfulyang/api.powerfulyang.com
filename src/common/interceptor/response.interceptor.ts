import { isGraphQLContext } from '@/common/graphql/isGraphQLContext';
import { getBaseDomain } from '@/common/interceptor/cookie.interceptor';
import { LoggerService } from '@/common/logger/logger.service';
import { Authorization, DefaultCookieOptions } from '@/constants/constants';
import { PathViewCountService } from '@/modules/path-view-count/path-view-count.service';
import { UserService } from '@/modules/user/user.service';
import type { ExtendRequest } from '@/type/ExtendRequest';
import { DateTimeFormat } from '@/utils/dayjs';
import { HOSTNAME } from '@/utils/hostname';
import type { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import type { FastifyReply } from 'fastify';
import { map } from 'rxjs';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  constructor(
    private readonly logger: LoggerService,
    private readonly userService: UserService,
    private readonly pathViewCountService: PathViewCountService,
  ) {
    this.logger.setContext(ResponseInterceptor.name);
  }

  intercept(_context: ExecutionContext, next: CallHandler) {
    if (isGraphQLContext(_context)) {
      return next.handle();
    }

    const ctx = _context.switchToHttp();
    const reply = ctx.getResponse<FastifyReply>();
    const request = ctx.getRequest<ExtendRequest>();
    const path = request.url;
    const { xRealIp } = request.raw.extend;

    return next.handle().pipe(
      map(async (data) => {
        if (request.user) {
          // 这样写是有问题的，可能同时有多个请求带上即将过期的 cookie，导致不必要的连续刷新
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
        const execTime = Date.now() - request.raw.extend.start;
        reply.header('x-server-exec-time', execTime);
        this.logger.verbose(`exec time: ${execTime}ms`);
        // 不再做统一格式处理，直接返回原始数据
        return data;
      }),
    );
  }
}
