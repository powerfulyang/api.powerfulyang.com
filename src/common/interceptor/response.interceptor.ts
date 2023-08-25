import { getRequestExtend, getRequestId, getRequestUser } from '@/request/namespace';
import type { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { FastifyReply, FastifyRequest } from 'fastify';
import { map } from 'rxjs';
import { ExcludeResponseInterceptorSymbol } from '@/common/decorator/exclude-response-interceptor.decorator';
import { isGraphQLContext } from '@/common/graphql/isGraphQLContext';
import { getBaseDomain } from '@/common/interceptor/cookie.interceptor';
import { LoggerService } from '@/common/logger/logger.service';
import { Authorization, DefaultCookieOptions } from '@/constants/constants';
import { PathViewCountService } from '@/path-view-count/path-view-count.service';
import { UserService } from '@/user/user.service';
import { DateTimeFormat } from '@/utils/dayjs';
import { HOSTNAME } from '@/utils/hostname';
import process from 'node:process';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  constructor(
    private readonly logger: LoggerService,
    private readonly userService: UserService,
    private readonly pathViewCountService: PathViewCountService,
    private readonly reflector: Reflector,
  ) {
    this.logger.setContext(ResponseInterceptor.name);
  }

  intercept(context: ExecutionContext, next: CallHandler) {
    if (isGraphQLContext(context)) {
      return next.handle();
    }

    const exclude = this.reflector.get(ExcludeResponseInterceptorSymbol, context.getHandler());
    if (exclude) {
      return next.handle();
    }

    const ctx = context.switchToHttp();
    const reply = ctx.getResponse<FastifyReply>();
    const request = ctx.getRequest<FastifyRequest>();
    const user = getRequestUser();
    const extend = getRequestExtend();
    const { xRealIp, start } = extend;
    const { url: path } = request;

    return next.handle().pipe(
      map(async (data) => {
        if (user) {
          // 这样写是有问题的，可能同时有多个请求带上即将过期的 cookie，导致不必要的连续刷新
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
            this.logger.verbose(
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
        const diff = process.hrtime(start);
        const execTime = diff[0] * 1e9 + diff[1]; // 纳秒
        const execTimeMs = execTime / 1e6; // 毫秒
        reply.header('x-server-exec-time', execTimeMs);
        reply.header('x-request-id', getRequestId());
        this.logger.verbose(`exec time: ${execTimeMs}ms, response data: ${JSON.stringify(data)}`);
        // 不再做统一格式处理，直接返回原始数据
        return data;
      }),
    );
  }
}
