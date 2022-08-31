import type { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import type { Observable } from 'rxjs';
import { map } from 'rxjs';
import { tap } from 'rxjs/operators';
import { LoggerService } from '@/common/logger/logger.service';
import { UserService } from '@/modules/user/user.service';
import { Authorization, DefaultCookieOptions } from '@/constants/constants';
import { PathViewCountService } from '@/modules/path-view-count/path-view-count.service';
import type { ExtendRequest } from '@/type/ExtendRequest';
import type { FastifyReply } from 'fastify';

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
      tap(async () => {
        if (request.user) {
          const { user } = request;
          const ValidPeriodSecond = user.exp - Date.now() / 1000;
          const ValidPeriodHour = ValidPeriodSecond / 3600;
          if (ValidPeriodHour < 6) {
            const authorization = await this.userService.generateAuthorization(user);
            reply.setCookie(Authorization, authorization, DefaultCookieOptions);
            this.logger.info(
              `Token valid within ${ValidPeriodHour}hour, refresh token [user=>${user.email}]`,
            );
          } else {
            this.logger.debug(
              `Token valid within ${ValidPeriodHour}hour, it's unnecessary to refresh token [user=>${user.email}]`,
            );
          }
        }
      }),
      map(async (data) => {
        let pathViewCount = 0;
        if (xRealIp) {
          pathViewCount = await this.pathViewCountService.handlePathViewCount(path, xRealIp);
        }
        const contentType = reply.getHeader('Content-Type');
        // 如果有 content-type 不处理
        if (contentType && contentType !== 'application/json') {
          return data;
        }
        // 默认返回json格式
        return {
          data,
          timestamp: new Date().toISOString(),
          path: request.url,
          pathViewCount,
        };
      }),
    );
  }
}
